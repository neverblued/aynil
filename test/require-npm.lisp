(set (lexical (datum _
		     (require "lodash"))
	      
	      (lambda _ (tool args)
		(apply (. _ tool) args))))

(= 42
   (+ 2 3 4
      (_ :sum (list 10 11 12))))
