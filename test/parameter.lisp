(set (lexical (lambda test-rest (foo &rest bar)
		(and (equal foo "12")
		     (equal bar (list "34" "56"))))))

(test-rest "12" "34" "56")
