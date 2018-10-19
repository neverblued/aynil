const _ = require ('lodash')
module.exports = lisp => {
    lisp.set (
        'dynamic', 'datum', 'pi',
        Math.PI
    )
    lisp.set (
        'dynamic', 'macro', 'result',
        [],
        function (...all) {
            return _.last (_.map (all, value => {
                const thing = this.evaluate (value)
                //console.log ('[lisp-basic] result', thing)
                return thing
            }))
        }
    )
    lisp.set (
        'dynamic', 'macro', 'set',
        [],
        function (...bindings) {
            //console.log ('[lisp-basic] set...')
            const objects = _.map (bindings, ([ scope, entity, name, ...value ]) => {
                //console.log ('[lisp-basic] set', scope, entity, name, '*value*')
                return this.set (scope, entity, name, ...value)
            })
            //console.log ('[lisp-basic] /set')
            return objects
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
//    lisp.set ('dynamic', 'macro', 'lambda', function (parameter, ...body) {
//        return this.stack (function () {
//            this.adapt (parameter)
//            return this.evaluate (['result', ...body])
//        })
//    })
//    lisp.set ('dynamic', 'macro', 'defun', function (name, parameter, ...body) {
//        this.set ('dynamic', 'lambda', name, function () {
//            return this.evaluate ([ 'lambda', parameter, ...body ])
//        })
//    })
//    lisp.set ('dynamic', 'macro', 'let*', function (bindings, ...body) {
//        return this.stack (function () {
//            _.forEach (bindings, ([ name, value ]) => {
//                this.set ('dynamic', 'datum', name, this.evaluate (value))
//            })
//            return this.evaluate ([ 'result', ...body])
//        })
//    })
}
