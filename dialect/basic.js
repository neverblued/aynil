const _ = require ('lodash')
const fs = require ('fs')
const path = require ('path')

module.exports = lisp => {
    
    lisp.set (
        'dynamic', 'lambda', '.',
        [],
        function (hashtable, key) {
            if (_.isObject (key) && 'name' in key) {
                key = key.name
            }
            if (hashtable && key in hashtable) {
                return hashtable [key]
            } else {
                return undefined
            }
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'apply',
        [],
        function (callable, parameter) {
	    return this.run (callable, parameter)
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'call',
        [],
        function (callable, ...parameter) {
	    return this.run (callable, ...parameter)
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'equal',
        [],
        function (first, ...rest) {
	    return _.every (rest, thing => {
		return _.isEqual (thing, first)
	    })
        }
    )

    lisp.set (
	'dynamic', 'lambda', 'evaluate',
	[ 'value' ],
	function (value) {
	    return this.evaluate (value)
	}
    )

    lisp.set (
	'dynamic', 'macro', 'get',
	[ 'name', '&key', 'scope', 'entity'],
	function (name, context) {
	    const { scope, entity } = context
	    return this.get (scope, entity, name)
	}
    )
    
    lisp.set (
        'dynamic', 'lambda', 'hashtable',
        [],
        function (...keysAndValues) {
            const hashtable = {}
            _.forEach (_.chunk (keysAndValues, 2), ([ key, value ]) => {
                hashtable [key.name || key] = value
            })
            return hashtable
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'key',
        [ 'name' ],
        function (name) {
            return this.evaluate (`:${ name }`)
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'let',
        [],
        function (scopes, ...body) {
            return this.stack (block => {
		_.forEach (scopes, ([ scope, ...bindings ]) => {
		    _.forEach (bindings, ([ entity, name, ...value ]) => {
			block.set (scope, entity, name, ...value)
		    })
		})
                return block.evaluate ([ 'result', ...body])
            })
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'list',
        [],
        function (...items) {
	    return items
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'quote',
        [],
        function (value) {
	    return value
	    //return this.quote (value) .evaluate (this)
        }
    )
    
    lisp.set (
        'dynamic', 'lambda', 'require',
        [ 'source' ],
        function (source) {
	    if (source [0] === '.') {
		const dirname = this.evaluate ('*dirname*')
		source = `${ dirname }/${ source }`
	    } else if (source [0] !== '/') {
		const dirname = this.evaluate ('*dirname*')
		let dir = dirname
		while (! fs.existsSync (dir + '/node_modules')) {
		    dir = path.resolve (dir, '..')
		    if (dir === '/') {
			let error = new Error (`bad require source ${ source }`)
			throw error
		    }
		}
		source = `${ dir }/node_modules/${ source }`
	    }
            return require (source)
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'result',
        [],
        function (...program) {
            return _.last (_.map (program, expression => {
                return this.evaluate (expression)
            }))
        }
    )
    
    lisp.set (
        'dynamic', 'macro', 'set',
        [],
        function (...scopes) {
            return _.flatten (_.map (scopes, ([ scope, ...bindings ]) => {
		return _.map (bindings, ([ entity, name, ...value ]) => {
                    return this.set (scope, entity, name, ...value)
		})
            }))
        }
    )

}
