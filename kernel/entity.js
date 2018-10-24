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
    
    evaluate (block, parameter) {
	debug ('evaluate lambda "%s" ...', this.name)
        return block.stack (block => {
	    let thing
            block.scope.lexical.integrate (this.block.scope.lexical)
            if (_.isFunction (this.body)) {
		debug ('evaluate lambda "%s" function ...', this.name)
                parameter = _.map (parameter, value => {
                    return block.evaluate (value)
                })
                thing = this.body.call (block, ...parameter)
            } else {
		debug ('evaluate lambda "%s" code ...', this.name)
                _.forEach (this.parameter, (name, index) => {
                    const value = parameter [index]
                    debug ('lambda bind parameter: %s %s %o', index, name, value)
                    block.set ('lexical', 'datum', name, value)
                })
		thing = block.evaluate ([ 'result', ...this.body ])
            }
	    debug ('/evaluate lambda "%s" ==>> [typeof %s] %s', this.name, typeof thing, thing)
	    return thing
        })
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
