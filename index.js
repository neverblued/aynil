const fs = require ('fs')
const path = require ('path')

const parser = require ('./kernel/parser')
const environment = new (require ('./kernel/block'))

require ('./dialect') (environment)

module.exports = file => {
    file = path.resolve (file)
    const code = fs.readFileSync (file, 'utf-8')
    const tree = parser.interpret (parser.read (code))
    return environment.closure (block => {
	block.set ('lexical', 'datum', '*module*', block.quote (module))
	block.set ('lexical', 'datum', '*dirname*', block.quote (path.dirname (file)))
	return block.evaluate (tree)
    })
}
