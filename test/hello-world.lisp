(set (lexical

      (datum hi "Hello")

      (lambda say-hi
          (target)
        (+ hi ", " target "!"))))

(say-hi "world")
