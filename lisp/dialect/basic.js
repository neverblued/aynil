const _ = require ('lodash')
module.exports = lisp => {
    lisp.set (
        'dynamic', 'lambda', '.',
        [],
        function (hashtable, key) {
            if ('name' in key) {
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
        'dynamic', 'macro', 'call',
        [],
        function (callable, ...parameter) {
            if (_.isFunction (callable)) {
                return callable (...parameter)
            } else if (_.isString (callable)) {
                const entity = this.lookup ('atom', 'callable', callable)
                return entity.evaluate (this, parameter)
            } else {
                const jsFunction = this.evaluate (callable)
                if (! _.isFunction (jsFunction)) {
                    let error = new Error ('not evaluated into function')
                    throw error
                }
                const args = _.map (parameter, this.evaluate.bind (this))
                return jsFunction.call (null, ...args)
            }
        }
    )
    lisp.set (
        'dynamic', 'lambda', 'hashtable',
        [],
        function (...keysAndValues) {
            const hashtable = {}
            _.forEach (_.chunk (keysAndValues, 2), ([ key, value ]) => {
                hashtable [key.name || key] = value
            })
            return hashtable
        }
    )
    lisp.set (
        'dynamic', 'macro', 'let',
        [],
        function (bindings, ...body) {
            return this.stack (block => {
                _.forEach (bindings, ([ scope, entity, name, ...value ]) => {
                    block.set (scope, entity, name, ...value)
                })
                return block.evaluate ([ 'result', ...body])
            })
        }
    )
    lisp.set (
        'dynamic', 'macro', 'list',
        [],
        function (...items) {
            return _.map (items, this.evaluate.bind (this))
        }
    )
    lisp.set (
        'dynamic', 'lambda', 'require',
        [ 'path' ],
        function (path) {
            return require (path)
        }
    )
    lisp.set (
        'dynamic', 'macro', 'result',
        [],
        function (...all) {
            return _.last (_.map (all, value => {
                return this.evaluate (value)
            }))
        }
    )
    lisp.set (
        'dynamic', 'macro', 'set',
        [],
        function (...bindings) {
            return _.map (bindings, ([ scope, entity, name, ...value ]) => {
                return this.set (scope, entity, name, ...value)
            })
        }
    )
}
