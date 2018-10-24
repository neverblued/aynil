(set (lexical (datum abc "alphabet")))

(and (equal "abc"
	    (quote abc))
     
     (equal "alphabet"
	    abc
	    (evaluate (quote abc))))
