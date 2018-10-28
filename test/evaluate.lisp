(set (lexical (datum exhibit "FooBar")))

(and
 
 ;; number ==>> number
 (equal (evaluate 42)
	42)

 ;; key ==>> key
 (equal (evaluate :a-key-evaluates-to-itself)
	:a-key-evaluates-to-itself)
 
 ;; string ==>> entity
 (equal (evaluate "exhibit")
	"FooBar")

 ;; list ==>> call
 (equal (evaluate (list "+" 2 3))
	5)
