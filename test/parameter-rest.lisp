(set (lexical (lambda test (foo &rest bar)
		(and (equal foo "12")
		     (equal bar (list "34" "56"))))))

(test "12" "34" "56")
