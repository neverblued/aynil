(now => {
    console.log (`
        ((( ${             '"FutuLisp"'  } )
          ( ${ now.format ('YYYY-MM-DD') } )
          ( ${ now.format ('HH:mm:ss.S') } )))
    `)
}) (require ('moment') ())
const code = require ('fs') .readFileSync ('./example/code.lisp', 'utf-8')
const lisp = require ('./lisp')
const tree = lisp.parse (code)
const result = lisp.compute (tree)
console.log (`
    => ${ result }
`)
