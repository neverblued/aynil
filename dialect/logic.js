const _ = require ('lodash')

module.exports = lisp => {
    
    lisp.set (
	'dynamic', 'lambda', 'and',
	[],
	function (...values) {
	    return _.every (values, value => {
		return !! value
	    })
	}
    )
    
    lisp.set (
	'dynamic', 'datum', 'false',
	false
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
	    return _.some (values, value => {
		return !! value
	    })
	}
    )
    
    lisp.set (
	'dynamic', 'datum', 'true',
	true
    )
    
}
