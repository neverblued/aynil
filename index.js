(now => {
    console.log (`
        ((( ${             '"FutuLisp"'  } )
          ( ${ now.format ('YYYY-MM-DD') } )
          ( ${ now.format ('HH:mm:ss.S') } )))
    `)
}) (require ('moment') ())
const lisp = require ('./lisp')
const code = require ('fs') .readFileSync ('./example/code.lisp', 'utf-8')
const tokens = lisp.read (code)
const tree = lisp.interpret (tokens)
const result = lisp.evaluate (tree)
console.log (`
    => ${ result }
`)
