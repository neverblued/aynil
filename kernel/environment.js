const _ = require ('lodash')
const fs = require ('fs')
const path = require ('path')
const debug = require ('debug') ('lisp-environment')

const Expression = require ('./expression')
const Scope = require ('./scope')

const placeholder = {
    dongle: id => `#DONGLE:${ id }#`,
}

const parser = {
    comment: new RegExp (';.*$', 'mg'),
    dongle: new RegExp (`^${ placeholder.dongle ('(\\d+)') }$`),
    key: new RegExp ('^:([^\\s\\"]+)$'),
    space: new RegExp ('[\\n\\t\\s]+', 'g'),
    string: new RegExp ('"([^"]*?)"'),
    token: new RegExp ('[\\(\\)]|[^\\n\\t\\s\\(\\)]+', 'g'),
}

const snippetLength = 42

class Environment {

    constructor (base = null) {
        this.base = base
        this.scope = {}
        _.forEach (Scope.order, scope => {
            this.scope [scope] = new (Scope.model [scope]) (this)
        })
    }
    
    check (scope, expression) {
        if (! (scope in Scope.model)) {
            let error = new Error (`bad scope "${ scope }"`)
            throw error
        }
        if (! (expression in Expression.model)) {
            let error = new Error (`bad expression "${ expression }"`)
            throw error
        }
    }
    
    closure (callback) {
        return this.stack (environment => {
            environment.scope.lexical.integrate (this.scope.lexical)
            return callback (environment)
        })
    }
    
    evaluate (value) {
        debug ('\\ evaluate %o', value)
        let result
        if (_.isUndefined (value) || _.isBoolean (value) || _.isNumber (value)) {
            result = value
        } else if (_.isString (value)) {
            result = this.evaluateAtom (value)
        } else if (_.isArray (value)) {
            result = this.evaluateList (value)
        } else if (value instanceof Expression.model.entity) {
            result = value.evaluate (this)
        } else {
            let error = new Error (`can not evaluate [${ typeof value }] ${ value }`)
            throw error
        }
	    const exhibit = _.isFunction (result) ? '#:FUNCTION' : result
	    debug ('/ evaluate %o ==>> [typeof %s] %o', value, typeof result, exhibit)
        return result
    }
    
    evaluateAtom (value) {
        const matchKey = value.match (parser.key)
        if (matchKey) {
            let [ match, name ] = matchKey
            return new Expression.model.key (this, name)
        } else {
            const matchString = value.match (parser.string)
            if (matchString) {
                let [ match, body ] = matchString
                return body
            } else {
                const number = _.toNumber (value)
                if (! _.isNaN (number)) {
                    return number
                } else {
                    const name = value
                    const entity = this.lookup ('atom', 'datum', name)
                    if (entity instanceof Expression.model.lambda) {
                        return entity.evaluator (this)
                    } else {
                        return entity.evaluate (this)
                    }
                }
            }
        }
    }
    
    evaluateList (value) {
        const [ name, ...args ] = value
	    const operator = this.lookup ('sexp', 'datum', name)
        const result = operator.evaluate (this, args)
        if (operator instanceof Expression.model.lambda) {
            return result
        } else {
            if (_.isFunction (result)) {
                return result ()
            } else {
                const error = new Error (`can not call [${ typeof result }] ${ result }`) 
                throw error
            }
        }
    }
    
    get (scope, expression, name) {
        this.check (scope, expression)
        return this.scope [scope] .get (expression, name)
    }

    interpret (tokens) {
        const tree = [ 'success' ]
        const nodes = []
        let node = tree
        let branch
        while (tokens.length) {
            const token = tokens.shift ()
            switch (token) {
                case '(':
                    branch = []
                    node.push (branch)
                    nodes.push (node)
                    node = branch
                    break
                case ')':
                    node = nodes.pop ()
                    if (! node) {
                        const code = tokens.join (' ') .substr (0, snippetLength)
                        let error = new Error (`syntax error before "${ code }"`)
                        throw error
                    }
                    break
                default:
                    node.push (token)
            }
        }
        return tree
    }
    
    lookup (order, model, name) {
        if (! (order in Expression.order.evaluate)) {
            let error = new Error (`bad order ${ order }`)
            throw error
        }
        let value
        _.some (Scope.order, scope => {
            return _.some (Expression.order.evaluate [order], expression => {
                value = this.scope [scope] .get (expression, name)
                return !! value
            })
        })
        if (! (value instanceof Expression.model [model])) {
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

    read (code) {
        const strings = {}
        let stringIndex = 0
        while (true) {
            const match = code.match (parser.string)
            if (! match) {
                break
            }
            const [ token ] = match
            const before = code.substr (0, match.index)
            const after = code.substr (match.index + token.length)
            code = before + placeholder.dongle (stringIndex) + after
            strings [_.toString (stringIndex)] = token
            stringIndex ++
        }
        code = code.replace (parser.comment, '')
        code = code.replace (parser.space, ' ')
        const tokens = code.match (parser.token)
        return _.map (tokens, token => {
            const match = token.match (parser.dongle)
            if (! match) {
                return token
            }
            const index = match [1]
            return strings [index]
        })
    }

    quote (value) {
	    debug ('quote [typeof %s] %o', typeof value, value)
	    return new Expression.model.quote (this, value)
    }
    
    run (operator, ...args) {
	    debug ('run [typeof %s] %s (%o) ...', typeof operator, operator, args)
        if (_.isFunction (operator)) {
	        const jsFunction = operator
	        debug ('run function: %s', jsFunction)
            return jsFunction (...args)
        } else if (operator instanceof Expression.model.macro) {
	        const expression = operator
	        debug ('run expression: %s', expression)
            return expression.evaluate (this, _.map (args, arg => {
		        return this.quote (arg)
	        }))
        } else if (_.isString (operator)) {
            const expression = this.lookup ('atom', 'symbol', operator)
	        debug ('run atom: %s', expression)
            return expression.evaluate (this, args)
        } else {
            let error = new Error (`can not run "${ operator }"`)
            throw error
        }
    }
    
    set (scope, expression, name, ...value) {
        this.check (scope, expression)
        return this.scope [scope] .set (
	        expression,
	        name,
	        new (Expression.model [expression]) (this, name, value)
	    )
    }
    
    stack (callback) {
        debug ('\\ stack')
        const environment = new Environment (this)
        const result = callback (environment)
        debug ('/ stack %s', result)
        return result
    }
}

module.exports = Environment
