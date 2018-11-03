const _ = require ('lodash')

module.exports = lisp => {
    
    lisp.set (
        'dynamic', 'lambda', 'and',
        [],
        function (...values) {
            return _.every (values, value => {
                return !! value
            }) ? _.last (values) : false
        }
    )
    
    lisp.set (
        'dynamic', 'datum', 'false',
        false
    )
    
    lisp.set (
        'dynamic', 'macro', 'if',
        [ 'clause', 'positive', 'negative' ],
        function (clause, positive, negative) {
            if (this.evaluate (clause)) {
                return this.evaluate (positive)
            } else {
                return this.evaluate (negative)
            }
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'not',
        [ 'value' ],
        function (value) {
            return ! value
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'or',
        [],
        function (...values) {
            return _.find (values, value => {
                return !! value
            })
        }
    )
    
    lisp.set (
        'dynamic', 'datum', 'true',
        true
    )
    
}
