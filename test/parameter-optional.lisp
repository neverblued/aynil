(set (lexical (lambda test (foo &optional (bar 10))
		(* foo (+ bar 1)))))

(and (= (test 5) 55)
     (= (test 3 21) 66))
