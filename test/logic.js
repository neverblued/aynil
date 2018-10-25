const expect = require ('chai') .expect
const lisp = require ('..')
describe ('logic features', function () {
    it ('support boolean values', function () {
	expect (lisp (__dirname + '/boolean.lisp')) .equal (true)
    })
    it ('support conditional macros', function () {
	expect (lisp (__dirname + '/conditional.lisp')) .equal (true)
    })
})
