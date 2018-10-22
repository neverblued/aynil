const expect = require ('chai') .expect
const lisp = require ('../..')
describe ('basic features', function () {
    it ('operate hashtables via ":NAME" key entities and "." accessor', function () {
	expect (lisp (__dirname + '/hashtable.lisp')) .equal (true)
    })
})
