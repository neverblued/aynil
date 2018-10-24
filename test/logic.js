const expect = require ('chai') .expect
const lisp = require ('..')
describe ('logic', function () {
    it ('boolean values are logically opposite', function () {
	expect (lisp (__dirname + '/logic-boolean.lisp')) .equal (true)
    })
})
