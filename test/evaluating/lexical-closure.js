const expect = require ('chai') .expect
const lisp = require ('../..')
describe ('evaluating', function () {
    it ('create a lexical closure for lambda declaration environment', function () {
	expect (lisp (__dirname + '/lexical-closure.lisp')) .equal (true)
    })
})
