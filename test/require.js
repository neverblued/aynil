const expect = require ('chai') .expect
const lisp = require ('..')
describe ('require', function () {
    it ('require node module', function () {
	expect (lisp (__dirname + '/require-node-module.lisp')) .equal (true)
    })
})
