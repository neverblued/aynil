const _ = require ('lodash')
module.exports = lisp => {
    lisp.set ('dynamic-macro', 'set', function (scope, name, value) {
        this.set (scope, name, value)
    })
    lisp.set ('dynamic-macro', 'result', function (...all) {
        return _.last (_.map (all, expression => {
            return this.evaluate (expression)
        }))
    })
    lisp.set ('dynamic-macro', 'lambda', function (parameter, ...body) {
        return this.branch (function () {
            this.adapt (parameter)
            return this.evaluate (['result', ...body])
        })
    })
    lisp.set ('dynamic-macro', 'defun', function (name, parameter, ...body) {
        this.set ('dynamic-function', name, function () {
            return this.evaluate ([ 'lambda', parameter, ...body ])
        })
    })
    lisp.set ('dynamic-macro', 'let*', function (bindings, ...body) {
        return this.branch (function () {
            _.forEach (bindings, ([ name, value ]) => {
                this.set ('dynamic-value', name, this.evaluate (value))
            })
            return this.evaluate ([ 'result', ...body])
        })
    })
    lisp.set ('dynamic-macro', 'let', function (bindings, ...body) {
        return this.branch (function () {
            _.forEach (bindings, ([ name, value ]) => {
                this.set ('lexical-value', name, this.evaluate (value))
            })
            return this.evaluate ([ 'result', ...body])
        })
    })
}
