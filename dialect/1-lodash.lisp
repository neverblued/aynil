(set (dynamic (datum _
                     (require "lodash" :js)))

     (dynamic (macro _
                     (method &rest args)
                     (backquote apply
                                (. _ (make-key (unquote method)))
                                (unquote (call (. _ :concat)
                                               (list (quote list))
                                               args))))))
