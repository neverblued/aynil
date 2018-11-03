const fs = require ('fs')
const path = require ('path')

const environment = new (require ('./kernel/environment'))

const setSpecial = (environment, name, value) => {
    environment.set ('lexical', 'datum', `*${ name }*`, environment.quote (value))
}

const lisp = file => {
    file = path.resolve (file)
    const code = fs.readFileSync (file, 'utf-8')
    const tree = environment.interpret (environment.read (code))
    return environment.closure (environment => {
        setSpecial (environment, 'module', module)
        setSpecial (environment, 'filename', file)
        setSpecial (environment, 'dirname', path.dirname (file))
        return environment.evaluate (tree)
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
        console.warn (`bad dialect source "${ file }"`)
    }
})

module.exports = lisp
