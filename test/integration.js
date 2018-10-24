const expect = require ('chai') .expect
const lisp = require ('..')
describe ('integration', function () {
    it ('imports evaluated lisp from a local file', function () {
	expect (lisp (__dirname + '/import-local.lisp')) .equal (true)
    })
    it ('requires JS value from a node module', function () {
	expect (lisp (__dirname + '/require-npm.lisp')) .equal (true)
    })
})
