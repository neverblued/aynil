module.exports = lisp => {
    require ('./basic') (lisp)
    require ('./io') (lisp)
    require ('./logic') (lisp)
    require ('./math') (lisp)
    require ('./string') (lisp)
    return lisp
}
