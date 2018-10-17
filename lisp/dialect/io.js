const _ = require ('lodash')
module.exports = lisp => {
    lisp.set ('dynamic-function', 'print', function (...all) {
        const log = console.log
        log.apply (log, all)
    })
}
