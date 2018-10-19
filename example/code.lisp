(let ((lexical datum hi "hello"))
  (set (dynamic lambda greet-world (name)
		(print name "says"
		       hi "to the world!"))))
(greet-world "Lisp")
					; answer
(+ 2 3 4 (+ 10 11 12))
