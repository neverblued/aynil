(set (lexical (lambda order-snack

		(main-course
		 &key drink (dessert "a sugar smile")
		 &optional (garnish "fries")
		 &rest other)
		
		(+ "I would like " main-course " with " garnish ", please."
		   (if drink (+ " And " drink ".") "")
		   " And " dessert " for dessert."
		   (if other (+ " Oh... " (_ join other " ")) "")))))

(equal
 
 (order-snack "double sandwich"
	      :drink "coffee" ; *
	      "big fries"
	      "Where is the toilet?"
	      "Thank you!")
       
 (+ "I would like double sandwich with big fries, please. And coffee. "
    "And a sugar smile for dessert. Oh... Where is the toilet? Thank you!")
