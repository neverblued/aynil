const expect = require ('chai') .expect
const lisp = require ('..')
describe ('basic features', function () {
    it ('evaluate quote into not evaluated source value', function () {
	expect (lisp (__dirname + '/basic-quote-evaluate.lisp')) .equal (true)
    })
    it ('use native array for a list', function () {
	expect (lisp (__dirname + '/basic-list.lisp')) .equal (true)
    })
    it ('operate hashtables via ":NAME" key entities and "." accessor', function () {
	expect (lisp (__dirname + '/basic-hashtable.lisp')) .equal (true)
    })
    it ('create a lexical closure for lambda declaration environment', function () {
	expect (lisp (__dirname + '/basic-lexical-closure.lisp')) .equal (true)
    })
})
