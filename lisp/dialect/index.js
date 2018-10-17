module.exports = lisp => {
    require ('./core') (lisp)
    require ('./io') (lisp)
    require ('./math') (lisp)
    return lisp
}
