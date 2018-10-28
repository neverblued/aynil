const _ = require ('lodash')
module.exports = lisp => {
    lisp.set (
        'dynamic', 'lambda', 'print',
        [],
        function (...all) {
	    console.log ('')
	    _.forEach (all, (thing, index) => {
		console.log (`    >>> №${ index } [typeof ${ typeof thing }] =`, thing)
	    })
	    console.log ('')
	    return _.last (all)
        }
    )
}
