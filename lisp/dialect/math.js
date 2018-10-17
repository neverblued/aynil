const _ = require ('lodash')
module.exports = lisp => {
    lisp.set ('dynamic-function', '+', function (first, ...rest) {
        return _.reduce (rest, (total, number) => {
            return total + number
        }, first)
    })
}
