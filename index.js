(now => {
    console.info (`
        ((( ${             '"FutuLisp"'  } )
          ( ${ now.format ('YYYY-MM-DD') } )
          ( ${ now.format ('HH:mm:ss.S') } )))
    `)
}) (require ('moment') ())
const fs = require ('fs')
const path = require ('path')
const parser = require ('./kernel/parser')
const environment = new (require ('./kernel/block'))
require ('./dialect') (environment)
module.exports = file => {
    file = path.resolve (file)
    const code = fs.readFileSync (path.resolve (file), 'utf-8')
    const tree = parser.interpret (parser.read (code))
    return environment.closure (block => {
    block.set ('lexical', 'symbol', '*module*', module)
    block.set ('lexical', 'datum', '*dirname*', JSON.stringify (path.dirname (file)))
    return block.evaluate (tree)
    })
}
