const _ = require ('lodash')

module.exports = lisp => {
    
    lisp.set (
        'dynamic', 'lambda', 'print',
        [],
        function (...expressions) {
            console.log ('')
            _.forEach (expressions, (expression, index) => {
                console.log (` ===>>> №${ index } [typeof ${ typeof expression }] =`, expression)
            })
            console.log ('')
            return _.last (expressions)
        }
    )
}
