const expect = require ('chai') .expect
const lisp = require ('../..')
describe ('integration', function () {
    it ('consume node packages', function () {
	expect (lisp (__dirname + '/npm.lisp')) .equal (true)
    })
})
