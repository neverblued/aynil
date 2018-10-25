const _ = require ('lodash')
module.exports = lisp => {
    lisp.set (
        'dynamic', 'lambda', 'print',
        [],
        function (...all) {
	    const message = _.join (all, '')
            console.log (`
    @=> ${ message }
`)
	    return message
        }
    )
}
