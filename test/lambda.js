const expect = require ('chai') .expect
const lisp = require ('..')
describe ('lambda features', function () {
    it ('support passing lambda as argument to native function', function () {
	expect (lisp (__dirname + '/argument-lambda.lisp')) .equal (true)
    })
    it ('support creating a lexical closure for lambda definition environment', function () {
	expect (lisp (__dirname + '/lexical-closure.lisp')) .equal (true)
    })
})
