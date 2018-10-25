const expect = require ('chai') .expect
const lisp = require ('..')
describe ('integration features', function () {
    it ('support requiring local lisp source files', function () {
	expect (lisp (__dirname + '/require-my-lisp.lisp')) .equal (true)
    })
    it ('support requiring js files from node modules', function () {
	expect (lisp (__dirname + '/require-npm-js.lisp')) .equal (true)
    })
})
