const expect = require ('chai') .expect
const lisp = require ('..')
describe ('file system', function () {
    it ('lexically bind source file directory path as *dirname*', function () {
	expect (lisp (__dirname + '/file-system-dirname.lisp')) .equal (true)
    })
})