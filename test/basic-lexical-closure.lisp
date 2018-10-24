(let ((lexical (datum hi "hello")))
  
  (set (dynamic (lambda say-hi (name)
		  (+ name " says " hi " to the world!")))))

(= (say-hi "Closure")
   "Closure says hello to the world!")
