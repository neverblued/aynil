(and
 
 (equal (if (= 5 (+ 2 3))
	    "five"
	    "not five")
	
	"five")

 (equal (when (= 4 (+ 2 2))
	  "that"
	  "is"
	  "totally"
	  "correct")
	
	"correct")


 (equal (unless (= 4 (+ 2 3))
	  "math"
	  "will"
	  "survive")
	
	"survive")
