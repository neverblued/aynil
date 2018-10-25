(set (lexical (datum _
		     (require "lodash" :js))))

(= (+ 2 3 4
      (call (. _ :sum)
	    (list 10 11 12)))
   42)
