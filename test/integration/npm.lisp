(set (dynamic datum _ (require "lodash")))

(= 42
   (+ 2 3 4
      (call (. _ :sum)
	    (list 10 11 12))))
