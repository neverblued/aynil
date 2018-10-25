const expect = require ('chai') .expect
const lisp = require ('..')
describe ('file system features', function () {
    it ('support lexically binding source file directory path as *dirname*', function () {
	expect (lisp (__dirname + '/dirname.lisp')) .equal (true)
    })
})
