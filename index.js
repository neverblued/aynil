const fs = require ('fs')
const path = require ('path')

const parser = require ('./kernel/parser')
const environment = new (require ('./kernel/block'))
require ('./dialect') (environment)

const lisp = file => {
    file = path.resolve (file)
    const code = fs.readFileSync (file, 'utf-8')
    const tree = parser.interpret (parser.read (code))
    return environment.closure (block => {
	block.set ('lexical', 'datum', '*module*', block.quote (module))
	block.set ('lexical', 'datum', '*filename*', block.quote (file))
	block.set ('lexical', 'datum', '*dirname*', block.quote (path.dirname (file)))
	return block.evaluate (tree)
    })
}

lisp ('./dialect/_.lisp')
lisp ('./dialect/when.lisp')
lisp ('./dialect/unless.lisp')
lisp ('./dialect/cond.lisp')

module.exports = lisp
