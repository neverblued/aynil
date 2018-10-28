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
            let error = new Error (`bad scope "${ scope }"`)
            throw error
        }
        if (! (entity in Entity.model)) {
            let error = new Error (`bad entity "${ entity }"`)
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
        debug ('\\ evaluate %o', value)
        let result
        if (_.isUndefined (value) || _.isBoolean (value) || _.isNumber (value)) {
            result = value
        } else if (value instanceof Entity.model.entity) {
            result = value.evaluate (this)
        } else if (_.isString (value)) {
            result = this.evaluateString (value)
        } else if (_.isArray (value)) {
            result = this.evaluateArray (value)
        } else {
            let error = new Error (`can not evaluate [${ typeof value }] ${ value }`)
            throw error
        }
	const exhibit = _.isFunction (result) ? '#:FUNCTION' : result
	debug ('/ evaluate %o ==>> [typeof %s] %o', value, typeof result, exhibit)
        return result
    }
    
    evaluateArray (value) {
        const [ name, ...parameter ] = value
	const entity = this.lookup ('sexp', 'lambda', name)
        return entity.evaluate (this, parameter)
    }
    
    evaluateString (value) {
        const match = value.match (/^:([^\s\"]+)$/)
        if (match) {
            const name = match [1]
            return new Entity.model.key (this, name)
        } else if (value.length >= 2 && value [0] === '"' && value [value.length - 1] === '"') {
            return value.substr (1, value.length - 2)
        } else {
            const number = _.toNumber (value)
            if (! _.isNaN (number)) {
                return number
            } else {
                const name = value
                const entity = this.lookup ('atom', 'datum', name)
                if (entity instanceof Entity.model.lambda) {
                    return entity.evaluator (this)
                } else {
                    return entity.evaluate (this)
                }
            }
        }
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
        let value
        _.some (Scope.order, scope => {
            return _.some (Entity.order.evaluate [order], entity => {
                value = this.scope [scope] .get (entity, name)
                return !! value
            })
        })
        if (! (value instanceof Entity.model [model])) {
            let error = new Error (`bad ${ model } "${ name }" in "${ this.evaluate ('*filename*') }"`)
            throw error
        }
	const exhibit = _.isFunction (value) ? '#:FUNCTION' : value
        debug ('lookup %s %s "%s" ==>> %s %s', order, model, name, typeof value, exhibit)
        return value
    }

    path (source, type = 'lisp') {
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
	if (fs.existsSync (resolved)) {
	    if (fs.statSync (resolved) .isDirectory ()) {
		resolved += `/index.${ type }`
	    }
	} else {
	    resolved += `.${ type }`
	}
	return resolved
    }
    
    quote (value) {
	debug ('quote [typeof %s] %o', typeof value, value)
	return new Entity.model.quote (this, value)
    }
    
    run (callable, ...args) {
	debug ('run [typeof %s] %s (%o) ...', typeof callable, callable, args)
        if (_.isFunction (callable)) {
	    const jsFunction = callable
	    debug ('run function: %s', jsFunction)
            return jsFunction (...args)
        } else if (callable instanceof Entity.model.macro) {
	    const entity = callable
	    debug ('run entity: %s', entity)
            return entity.evaluate (this, _.map (args, arg => {
		return this.quote (arg)
	    }))
        } else if (_.isString (callable)) {
            const entity = this.lookup ('atom', 'symbol', callable)
	    debug ('run atom: %s', entity)
            return entity.evaluate (this, args)
        } else {
            let error = new Error (`can not run "${ callable }"`)
            throw error
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
        debug ('\\ stack')
        const block = new Block (this)
        const result = callback (block)
        debug ('/ stack %s', result)
        return result
    }
}

module.exports = Block
