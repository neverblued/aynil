module.exports = lisp => {
    require ('./basic') (lisp)
    require ('./io') (lisp)
    require ('./math') (lisp)
    return lisp
}
