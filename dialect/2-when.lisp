(set (dynamic
      
      (macro when
             (clause &rest body)

             (list (quote if)
                   clause
                   (_ concat
                      (list (quote success))
                      body)))
