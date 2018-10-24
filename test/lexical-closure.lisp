(let ((lexical (datum good "awesome")))
  
  (set (dynamic (lambda imho-good (subject)
		  (+ subject " is " good "!")))))

(equal (imho-good "Closure") "Closure is awesome!")
