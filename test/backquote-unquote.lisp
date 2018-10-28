(set (lexical (datum bar "unquoted")))

(equal (backquote foo
		  (unquote bar)
		  baz)

       (list (quote foo)
	     bar
	     (quote baz)))
