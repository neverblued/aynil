(set (dynamic (macro cond
		     (&rest rules)
		     (let ((lexical (lambda cond-tail
				      (rules)
				      
				      (let ((lexical (datum rule (_ head rules))
						     (datum rule-clause (_ head rule))
						     (datum rule-result (_ tail rule))
						     (datum next-rules (_ tail rules))))
					
					(list (quote if)
					      rule-clause
					      (_ concat
						 (list (quote result))
						 rule-result)
					      (when (. next-rules :length)
						(cond-tail next-rules)))))))

		       (cond-tail rules)))))
