(let ((lexical (datum items
		      (list "AAA" "BBB" "CCC"))
	       
	       (lambda foo (item)
		 (+ "XX" item "YY"))))

  (equal (call (. _ :join)
	       (call (. _ :map) items foo)
	       "-=-")
	 
	 "XXAAAYY-=-XXBBBYY-=-XXCCCYY"))
