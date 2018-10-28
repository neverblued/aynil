const _ = require ('lodash')
const debug = require ('debug') ('lisp-entity')
const Scope = require ('./scope')

class Entity {

    constructor (block) {
        this.block = block
    }
    
    inspect () {
        return this.toString ()
    }

    equal (thing) {
	return _.isEqual (thing, this)
    }
    
    evaluate () {
	throw new Error ('can not evaluate abstract entity')
    }
}

class Quote extends Entity {

    constructor (block, value) {
	super (block)
	this.value = value
    }

    evaluate () {
	return this.value
    }
}

class Key extends Entity {

    constructor (block, name) {
        super (block)
        this.name = name
    }
    
    equal (thing) {
	return thing instanceof Key && thing.name === this.name
    }
    
    evaluate () {
        return this
    }

    toString () {
        return `#K:${ _.toUpper (this.name) }`
    }
}

class Datum extends Key {
    
    constructor (block, name, value) {
        super (block, name)
	if (value) {
            this.body = block.evaluate (_.first (value))
	}
    }

    evaluate () {
        return this.body
    }

    toString () {
        return `#D:${ _.toUpper (this.name) }`
    }
}

class Symbol extends Datum {
    
    constructor (block, name, value) {
        super (block, name)
	this.body = value
    }

    evaluate (block) {
        if (_.isFunction (this.body)) {
            return this.body.call (block)
        } else {
            return block.evaluate (this.body)
        }
    }

    toString () {
        return `#S:${ _.toUpper (this.name) }`
    }
}

class Lambda extends Symbol {

    constructor (block, name, value) {
	const [ parameter, ...body ] = value
	const head = _.first (body)
        super (block, name, _.isFunction (head) ? head : body)
        this.parameter = parameter
    }

    accept (args, callback) {
	const modes = [ '&optional', '&rest', '&key' ]
	let mode
	callback (_.compact (_.map (this.parameter, parameter => {
	    if (_.includes (modes, parameter)) {
		mode = parameter
		return undefined
	    }
	    let paramName, paramDefault
	    let value
	    let isList = false
	    
	    if (mode === '&key') {
		if (_.isArray (parameter)) {
		    [ paramName, paramDefault ] = parameter
		} else {
		    paramName = parameter
		}
		const index = _.indexOf (args, `:${ paramName }`)
		if (index < 0) {
		    value = paramDefault
		} else {
		    value = args [index + 1]
		    args = _.concat (_.slice (args, 0, index), _.slice (args, index + 2))
		}
		debug ('parameter: "%s" &key = [typeof %s] %o', paramName, typeof value, value)

	    } else if (mode === '&rest') {
		paramName = parameter
		value = [ ...args ]
		isList = true
		debug ('parameter: "%s" &rest = [typeof %s] %o', paramName, typeof value, value)

	    } else if (mode === '&optional') {
		if (_.isArray (parameter)) {
		    [ paramName, paramDefault ] = parameter
		} else {
		    paramName = parameter
		}
		if (args.length) {
		    value = args [0]
		    args = _.slice (args, 1)
		} else {
		    value = paramDefault
		}
		debug ('parameter: "%s" &optional = [typeof %s] %o', paramName, typeof value, value)

	    } else {
		paramName = parameter
		if (args.length) {
		    value = args [0]
		    args = _.slice (args, 1)
		}
		debug ('parameter: "%s" = [typeof %s] %o', paramName, typeof value, value)
		
	    }
	    return [ paramName, value, isList ]
        })))
    }
    
    evaluate (block, args) {
	debug ('\\ evaluate lambda "%s"', this.name)
        return block.stack (block => {
	    let result
            block.scope.lexical.integrate (this.block.scope.lexical)
	    
            if (_.isFunction (this.body)) {
		debug ('evaluate lambda "%s" function', this.name)
                result = this.body.apply (block, _.map (args, value => {
                    return block.evaluate (value)
                }))
		
            } else {
		debug ('evaluate lambda "%s" code', this.name)
		this.accept (args, args => {
		    _.forEach (args, ([ name, value, isList ]) => {
			block.set ('lexical', 'datum', name, isList ? [ 'list', ...value ] : value)
		    })
		    result = block.evaluate ([ 'result', ...this.body ])
		})
		
            }
	    const exhibit = _.isFunction (result) ? '#:FUNCTION' : result
	    debug ('/ evaluate lambda "%s" ==>> [typeof %s] %s', this.name, typeof result, exhibit)
	    return result
        })
    }

    evaluator (block) {
	return (...args) => {
	    return this.evaluate (block, _.map (args, arg => {
		return block.quote (arg)
	    }))
	}
    }
    
    toString () {
        return `#L:${ _.toUpper (this.name) }`
    }
}

class Macro extends Lambda {
    
    constructor (block, name, value) {
	super (block, name, value)
    }
    
    evaluate (block, args) {
	let result
	if (_.isFunction (this.body)) {
	    debug ('\\ evaluate macro "%s" function', this.name)
            result = this.body.call (block, ...args)
        } else {
	    debug ('\\ evaluate macro "%s" code', this.name)
	    let expanded
	    this.accept (args, args => {
		_.forEach (args, ([ name, value, isList ]) => {
		    block.set ('lexical', 'datum', name, block.quote (value))
		})
		expanded = block.evaluate ([ 'result', ...this.body ])
	    })
	    debug ('expanded macro "%s" ==>> %o', this.name, expanded)
	    result = block.evaluate (expanded)
        }
	const exhibit = _.isFunction (result) ? '#:FUNCTION' : result
	debug ('/ evaluate macro "%s" ==>> [typeof %s] %s', this.name, typeof result, exhibit)
	return result
    }

    toString () {
        return `#M:${ _.toUpper (this.name) }`
    }
}

module.exports = {
    
    model: {
        datum: Datum,
	entity: Entity,
	key: Key,
        lambda: Lambda,
        macro: Macro,
	quote: Quote,
        symbol: Symbol,
    },
    
    order: {
        evaluate: {
            atom: [ 'symbol', 'datum', 'macro', 'lambda' ],
            sexp: [ 'macro', 'lambda' ],
        },
        scope: [ 'symbol', 'datum', 'macro', 'lambda' ],
    },
}
