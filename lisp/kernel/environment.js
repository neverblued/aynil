const _ = require ('lodash')
const callable = require ('./callable')
const dongle = id => `#DONGLE:${id}#`
const parser = {
    comment: new RegExp (';.*$', 'mg'),
    dongle: new RegExp (`^${ dongle ('(\\d+)') }$`),
    string: new RegExp ('"([^"]*?)"'),
    space: new RegExp ('[\\n\\t\\s]+', 'g'),
    token: new RegExp ('[\\(\\)]|[^\\n\\t\\s\\(\\)]+', 'g'),
}
class environment {
    constructor (...imports) {
        this.scopes = [
            'lexical-macro',
            'dynamic-macro',
            'lexical-function',
            'dynamic-function',
            'lexical-value',
            'dynamic-value',
        ]
        this.imports = imports
        this.bindings = {}
        _.forEach (this.scopes, scope => {
            this.bindings [scope] = {}
        })
    }
    branch (callback) {
        return callback.call (new environment (this))
    }
    import (source) {
        if (! _.includes (this.imports, source)) {
            this.imports.push (source)
        }
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
            code = before + dongle (stringIndex) + after
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
    interpret (tokens) {
        const tree = [ 'result' ]
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
                    break
                default:
                    node.push (token)
            }
        }
        return tree
    }
    set (scope, name, value) {
        if (! scope in this.scopes) {
            throw new Error (`invalid scope: ${scope}`)
        }
        this.bindings [scope] [name] = (() => {
            if (_.isFunction (value)) {
                if (/macro$/i.test (scope)) {
                    return new callable.macro (name, value)
                } else {
                    return new callable.func (name, value)
                }
            } else {
                return value
            }
        }) ()
    }
    get (scope, name) {
        if (! scope in this.scopes) {
            throw new Error (`invalid scope: ${scope}`)
        }
        return this.bindings [scope] [name]
    }
    stack () {
        let stack = [ this ]
        _.forEach (this.imports, source => {
            stack = _.concat (stack, source.stack ())
        })
        return stack
    }
    evaluate (value) {
        if (_.isArray (value)) {
            const [ name, ...parameters ] = value
            let handler
            const stack = this.stack ()
            const scoped = _.some (stack, environment => {
                const scopes = _.filter (environment.scopes, /macro$|function$/i)
                const scope = _.find (scopes, scope => {
                    return name in environment.bindings [scope]
                })
                if (scope) {
                    handler = environment.bindings [scope] [name]
                    return true
                }
            })
            if (! scoped) {
                throw new Error (`bad call ${ _.toUpper (name) } (${ stack.length })`)
            }
            if (! (handler instanceof callable.entity)) {
                throw new Error (`bad handler ${ handler } typeof ${ typeof handler }`)
            }
            return handler.trigger (this, parameters)
        } else {
            if (value.length > 2 && value [0] === '"' && value [value.length - 1] === '"') {
                return value.substr (1, value.length - 2)
            }
            const number = _.toNumber (value)
            if (! _.isNaN (number)) {
                return number
            }
            const name = value
            let result
            const stack = this.stack ()
            const scoped = _.some (stack, environment => {
                const scopes = _.filter (environment.scopes, /value$/i)
                const scope = _.find (scopes, scope => {
                    return name in environment.bindings [scope]
                })
                if (scope) {
                    result = environment.bindings [scope] [name]
                    return true
                }
            })
            if (! scoped) {
                throw new Error (`bad value ${ _.toUpper (value) } (${ stack.length })`)
            }
            return result
        }
    }
    adapt (parameter) {
        // TODO
    }
}
module.exports = environment
