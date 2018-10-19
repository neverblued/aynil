const _ = require ('lodash')
module.exports = lisp => {
    lisp.set (
        'dynamic', 'lambda', '+',
        [],
        function (first, ...rest) {
            return _.reduce (rest, (total, number) => {
                return total + number
            }, first)
        }
    )
}
