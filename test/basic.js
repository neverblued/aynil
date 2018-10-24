const expect = require ('chai') .expect
const lisp = require ('..')
describe ('basic use case', function () {
    it ('operates hashtables via key symbols and the dot accessor', function () {
	expect (lisp (__dirname + '/hashtable.lisp')) .equal (true)
    })
    it ('creates a lexical closure for lambda definition environment', function () {
	expect (lisp (__dirname + '/lexical-closure.lisp')) .equal (true)
    })
    it ('represents list as native array', function () {
	expect (lisp (__dirname + '/list.lisp')) .equal (true)
    })
    it ('evaluates quote into not evaluated source value', function () {
	expect (lisp (__dirname + '/quote-evaluate.lisp')) .equal (true)
    })
})
