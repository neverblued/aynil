(set (dynamic datum _
	      (require "lodash")))

(let ((lexical datum hello "how do you do")
      (lexical symbol hi hello))
  (set (dynamic lambda say-hi (name)
		(print name "says"
		       hi "to the world!"))))
(print say-hi)
(say-hi "Dummy")

(print (hashtable :id 5
		  :name "five"))
					; answer
(+ 2 3 4
   (call (. _ :sum)
	 (list 10 11 12)))
