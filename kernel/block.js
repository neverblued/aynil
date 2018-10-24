const _ = require ('lodash')
const fs = require ('fs')
const path = require ('path')
const debug = require ('debug') ('lisp-block')

const Entity = require ('./entity')
const Scope = require ('./scope')

class Block {

    constructor (base = null) {
        this.base = base
        this.scope = {}
        _.forEach (Scope.order, scope => {
            this.scope [scope] = new (Scope.model [scope]) (this)
        })
    }

    check (scope, entity) {
        if (! (scope in Scope.model)) {
            let error = new Error (`bad scope ${ scope }`)
            throw error
        }
        if (! (entity in Entity.model)) {
            let error = new Error (`bad entity ${ entity }`)
            throw error
        }
    }

    closure (callback) {
        return this.stack (block => {
            block.scope.lexical.integrate (this.scope.lexical)
            return callback (block)
        })
    }
    
    evaluate (value) {
        debug ('evaluate: %o ...', value)
        let thing
        if (_.isUndefined (value) || _.isBoolean (value) || _.isNumber (value)) {
            thing = value
        } else if (_.isString (value)) {
            const match = value.match (/^:([^\s\"]+)$/)
            if (match) {
                const name = match [1]
                thing = new Entity.model.key (this, name)
            } else if (value.length >= 2 && value [0] === '"' && value [value.length - 1] === '"') {
                thing = value.substr (1, value.length - 2)
            } else {
                const number = _.toNumber (value)
                if (! _.isNaN (number)) {
                    thing = number
                } else {
                    const name = value
                    const entity = this.lookup ('atom', 'datum', name)
                    if (entity instanceof Entity.model.symbol) {
                        thing = entity
                    } else {
                        thing = entity.evaluate (this)
                    }
                }
            }
        } else if (_.isArray (value)) {
            const [ name, ...parameter ] = value
	    const entity = this.lookup ('sexp', 'macro', name)
            thing = entity.evaluate (this, parameter)
        } else if (value instanceof Entity.model.entity) {
            const entity = value
            thing = entity.evaluate (this)
        } else {
            let error = new Error (`can not evaluate [${ typeof value }] ${ value }`)
            throw error
        }
	debug ('/evaluate: %o ==>> [typeof %s] %s', value, typeof thing, thing)
        return thing
    }
    
    get (scope, entity, name) {
        this.check (scope, entity)
        return this.scope [scope] .get (entity, name)
    }

    lookup (order, model, name) {
        if (! (order in Entity.order.evaluate)) {
            let error = new Error (`bad order ${ order }`)
            throw error
        }
        let thing
        _.some (Scope.order, scope => {
            return _.some (Entity.order.evaluate [order], entity => {
                thing = this.scope [scope] .get (entity, name)
                return !! thing
            })
        })
        if (! (thing instanceof Entity.model [model])) {
            const exhibit = `(typeof ${ typeof thing }) ${ thing }`
            let error = new Error (`bad ${ model } ${ name } => ${ exhibit }`)
            throw error
        }
        debug ('lookup: %s %s %s ==>> %s %s', order, model, name, typeof thing, thing)
        return thing
    }

    path (source) {
	let resolved
	if (source [0] === '.') {
	    let folder = this.evaluate ('*dirname*')
	    resolved = `${ folder }/${ source }`
	} else if (source [0] !== '/') {
	    let folder = this.evaluate ('*dirname*')
	    while (! fs.existsSync (folder + '/node_modules')) {
		folder = path.resolve (folder, '..')
		if (folder === '/') {
		    let error = new Error (`bad source path "${ source }"`)
		    throw error
		}
	    }
	    resolved = `${ folder }/node_modules/${ source }`
	}
	return resolved
    }
    
    quote (value) {
	return new Entity.model.quote (this, value)
    }
    
    run (callable, ...parameter) {
	debug ('run [typeof %s] %s (%o) ...', typeof callable, callable, parameter)
        if (_.isFunction (callable)) {
	    const jsFunction = callable
	    debug ('run function: %s', callable)
            return jsFunction (...parameter)
        } else if (_.isString (callable)) {
            const entity = this.lookup ('atom', 'callable', callable)
	    debug ('run atom: %s', callable)
            return entity.evaluate (this, parameter)
        } else {
            const jsFunction = this.evaluate (callable)
            if (! _.isFunction (jsFunction)) {
                let error = new Error ('not evaluated into function')
                throw error
            }
	    debug ('run: %s', callable)
            return jsFunction (...parameter)
        }
    }

    set (scope, entity, name, ...value) {
        this.check (scope, entity)
        return this.scope [scope] .set (
	    entity,
	    name,
	    new (Entity.model [entity]) (this, name, value)
	)
    }

    stack (callback) {
        debug ('stack ...')
        const block = new Block (this)
        const thing = callback (block)
        debug ('/stack: %s', thing)
        return thing
    }
}

module.exports = Block
