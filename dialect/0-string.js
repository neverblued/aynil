module.exports = lisp => {
    
    lisp.set (
        'dynamic', 'lambda', 'regexp-test',
        [ 'source', 'template', '&optional', 'flag' ],
        function (source, template, flag) {
            return (new RegExp (template, flag)) .test (source)
        }
    )
}
