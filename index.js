const fs = require ('fs')
const path = require ('path')

const parser = require ('./kernel/parser')
const environment = new (require ('./kernel/block'))

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

const dialect = `${ __dirname }/dialect`
fs.readdirSync (dialect) .forEach (file => {
    if (/^\./ .test (file)) {
	return;
    } else if (/\.lisp$/ .test (file)) {
	lisp (`${ dialect }/${ file }`)
    } else if (/\.js$/ .test (file)) {
	require (`${ dialect }/${ file }`) (environment)
    } else {
	throw new Error (`bad dialect source "${ file }"`)
    }
})

module.exports = lisp
