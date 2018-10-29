(set (dynamic

      (macro unless
          (clause &rest body)

        (_ concat
           (backquote when
                      (not (unquote clause)))
                      body))
