(= (+ 2 3 4
      (call (. (require "lodash" :js) :sum)
	    (list 10 11 12)))
   42)
