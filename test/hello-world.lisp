(let ((lexical (datum hi "Hello")
               (lambda say-hi (name)
                 (+ hi ", " name "!"))))
  (say-hi "world"))
