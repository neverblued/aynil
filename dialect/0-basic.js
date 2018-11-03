const _ = require ('lodash')

const Expression = require ('../kernel/expression')

module.exports = lisp => {
    
    lisp.set (
        'dynamic', 'lambda', '.',
        [],
        function (hashtable, key) {
            if (key instanceof Expression.model.key) {
                key = key.name
            }
            if (hashtable && key in hashtable) {
                return hashtable [key]
            } else {
                return undefined
            }
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'apply',
        [],
        function (operator, args) {
            return this.run (operator, ...args)
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'backquote',
        [],
        function (...body) {
            const unquoted = value => {
                if (_.isArray (value)) {
                    const [ first, ...rest ] = value
                    if (first === 'unquote') {
                        return this.evaluate ([ 'success', ...rest ])
                    } else {
                        return _.map (value, unquoted)
                    }
                } else {
                    return value
                }
            }
            return unquoted (body)
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'call',
        [],
        function (operator, ...args) {
            return this.run (operator, ...args)
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'equal',
        [],
        function (first, ...rest) {
            return _.every (rest, thing => {
                if (first instanceof Expression.model.entity) {
                    return first.equal (thing)
                } else {
                    return _.isEqual (first, thing)
                }
            })
        }
    )

    lisp.set (
        'dynamic', 'lambda', 'evaluate',
        [ 'value' ],
        function (value) {
            return this.evaluate (value)
        }
    )

    lisp.set (
        'dynamic', 'macro', 'get',
        [ 'name', '&key', 'scope', 'model'],
        function (name, context) {
            const { scope, model } = context
            return this.get (scope, model, name)
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'hashtable',
        [],
        function (...pairs) {
            return _.reduce (_.chunk (pairs, 2), function (hashtable, [ key, value ]) {
                if (key instanceof Expression.model.key) {
                    key = key.name
                }
                hashtable [key] = value
                return hashtable
            }, {})
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'let',
        [],
        function (scopes, ...body) {
            return this.stack (block => {
                _.forEach (scopes, ([ scope, ...bindings ]) => {
                    _.forEach (bindings, ([ expression, name, ...value ]) => {
                        block.set (scope, expression, name, ...value)
                    })
                })
                return block.evaluate ([ 'success', ...body])
            })
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'list',
        [],
        function (...items) {
            return items
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'make-key',
        [ 'name' ],
        function (name) {
            return this.evaluate (`:${ name }`)
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'quote',
        [],
        function (value) {
            return value
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'require',
        [ 'source', 'type' ],
        function (source, mode) {
            const type = mode && mode.name
            source = this.path (source, type)
            if (type === 'js') {
                return require (source)
            } else {
                return require ('..') (source)
            }
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'set',
        [],
        function (...scopes) {
            return _.flatten (_.map (scopes, ([ scope, ...bindings ]) => {
                return _.map (bindings, ([ expression, name, ...value ]) => {
                    return this.set (scope, expression, name, ...value)
                })
            }))
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'signal',
        [],
        function (condition) {
            throw new Error (condition)
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'success',
        [ '&rest', 'expressions' ],
        function (...expressions) {
            return _.last (_.map (expressions, expression => {
                return this.evaluate (expression)
            }))
        }
    )
    
}
