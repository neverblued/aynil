(and
 
 ;; when
 
 (equal (when (= 4 (+ 2 2))
	  "that"
	  "is"
	  "totally"
	  "correct")
	
	"correct")

 ;; unless
 
 (equal (unless (= 4 (+ 2 3))
	  "math"
	  "will"
	  "survive")
	
	"survive")
 
 ;; cond
 
 (let ((lexical (lambda water-state (t)
		  (cond ((> t 100) "steam")
			((> t 97)  "boiling")
			((> t 50)  "hot")
			((> t 25)  "warm")
			((> t 0)   "cold")
			(true      "ice")))))
   
   (and (equal (water-state 90) "hot")
	(equal (water-state 15) "cold")
	(equal (water-state -3) "ice")))
