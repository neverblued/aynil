const _ = require ('lodash')
module.exports = lisp => {
    lisp.set (
        'dynamic', 'datum', 'pi',
        Math.PI
    )
    lisp.set (
        'dynamic', 'lambda', '+',
        [],
        function (first, ...rest) {
            return _.reduce (rest, (total, number) => {
                return total + number
            }, first)
        }
    )
    lisp.set (
        'dynamic', 'lambda', '-',
        [],
        function (first, ...rest) {
            return _.reduce (rest, (total, number) => {
                return total - number
            }, first)
        }
    )
    lisp.set (
        'dynamic', 'lambda', '*',
        [],
        function (first, ...rest) {
            return _.reduce (rest, (total, number) => {
                return total * number
            }, first)
        }
    )
    lisp.set (
        'dynamic', 'lambda', '/',
        [ 'first', '...', 'rest' ],
        function (first, ...rest) {
            return _.reduce (rest, (total, number) => {
                return total / number
            }, first)
        }
    )
}
