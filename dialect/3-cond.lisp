(set (dynamic
      
      (macro cond (&rest rules)
	     (let ((lexical
		    
		    (lambda cond-recursion (rules)
		      (let ((lexical
			     
			     (datum rule (_ head rules))
			     (datum clause (_ head rule))
			     (datum effect (_ tail rule))
			     (datum next (_ tail rules))))
			
			(list (quote if)
			      clause
			      (_ concat
				 (list (quote result))
				 effect)
			      (when (. next :length)
				(cond-recursion next)))))))

	       (cond-recursion rules)))))
