const expect = require ('chai') .expect
const lisp = require ('..')
describe ('basic features', function () {
    it ('support hashtables via key symbols and the dot accessor', function () {
	expect (lisp (__dirname + '/hashtable.lisp')) .equal (true)
    })
    it ('support representing a list in the form of native array', function () {
	expect (lisp (__dirname + '/list.lisp')) .equal (true)
    })
    it ('support quoting and evaluating', function () {
	expect (lisp (__dirname + '/quote-evaluate.lisp')) .equal (true)
    })
})
