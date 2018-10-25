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

class Macro extends Symbol {
    
    constructor (block, name, value) {
	const [ parameter, ...body ] = value
        super (block, name, _.isFunction (_.first (body)) ? _.first (body) : body)
        this.parameter = parameter
    }

    evaluate (block, parameter) { 
	let thing
	if (_.isFunction (this.body)) {
	    debug ('evaluate macro "%s" function ...', this.name)
            thing = this.body.call (block, ...parameter)
        } else {
	    debug ('evaluate macro "%s" code ...', this.name)
            _.forEach (this.parameter, (name, index) => {
                block.set ('lexical', 'datum', name, parameter [index])
            })
	    thing = block.evaluate ([ 'result', ...this.body ])
        }
	debug ('/evaluate macro "%s" ==>> [typeof %s] %s', this.name, typeof thing, thing)
	return thing
    }

    toString () {
        return `#M:${ _.toUpper (this.name) }`
    }
}

class Lambda extends Macro {

    constructor (block, name, value) {
        super (block, name, value)
    }
    
    evaluate (block, args) {
	debug ('evaluate lambda "%s" ...', this.name)
        return block.stack (block => {
	    let thing
            block.scope.lexical.integrate (this.block.scope.lexical)
            if (_.isFunction (this.body)) {
		debug ('evaluate lambda "%s" function ...', this.name)
                thing = this.body.apply (block, _.map (args, value => {
                    return block.evaluate (value)
                }))
            } else {
		debug ('evaluate lambda "%s" code ...', this.name)
		const parameter = this.parameter
		let modeKey = false
		let modeOptional = false
		let modeRest = false
		let indexArg = 0
                _.every (parameter, (nameParam, indexParam) => {
		    if (nameParam === '&rest') {
			modeRest = true
			return true
		    }
		    let valueArg
		    if (modeRest) {
			valueArg = _.concat ([ 'list' ], _.slice (args, indexArg))
		    } else {
			valueArg = args [indexArg ++]
		    }
                    debug ('accept argument: №%d "%s" = [typeof %s] %o', indexParam, nameParam, typeof valueArg, valueArg)
                    block.set ('lexical', 'datum', nameParam, valueArg)
		    if (modeRest) {
			return false
		    }
		    return true
                })
		thing = block.evaluate ([ 'result', ...this.body ])
            }
	    debug ('/evaluate lambda "%s" ==>> [typeof %s] %s', this.name, typeof thing, thing)
	    return thing
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
