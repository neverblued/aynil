(set (lexical (lambda test (foo &key bar (baz 10))
		(= 42 (+ (+ foo baz)
			 (or bar 15))))))

(and (test 17)
     (test 12 :bar 20)
     (test 14 :baz 13)
     (test 30 :bar 9 :baz 3))
