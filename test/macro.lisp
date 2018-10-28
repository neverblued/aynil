(set (lexical (macro water-state (body)
		     (backquote
		      (unquote body)
		      (unquote body)))))

(do-twice (result (print "Hello!")
		  (print "I do everything twice.")))
true
