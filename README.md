FutuLisp
========

JavaScript framework for hacking the future.


Usage tips
----------

#### Apply

```javascript
require ('futulisp') (__dirname + '/hello-world.lisp')
```

#### Enjoy

```lisp
(let ((lexical (datum hi "Hello")
               (lambda say-hi (name)
		         (print hi "," name "!"))))
  (say-hi "world"))
```

#### Use another file

You may require lisp source files which are located either absolutely and relatively to the current code:

```lisp
(require (+ *dirname* "/component.lisp"))
(require "./component.lisp")
```

#### Use any node module

This also works:

```lisp
(set (dynamic (datum _ (require "lodash"))))
(+ 2 3 4
   (call (. _ :sum)
	     (list 10 11 12)))
```

#### Test examples

```bash
npm start
```


Syntax tips
-----------

#### Scope

* Lexical
* Dynamic

#### Entity

* Key — evaluates to itself
* Datum — evaluates in the declaration environment
* Symbol — may be called and evaluates in the call environment
* Lambda — accepts evaluated call parameters and creates a lexical closure
* Macro — parameters may be evaluated manually and no closure is created

#### Binding

Depending on the entity,
one value item may represent a datum value or a symbol body.
In case of callable entities that accept arguments,
first of the multiple values should represent formal parameters,
as in Common Lisp:

```
Value = "(" ( Primitive | Body | Parameter Body {Body} ) ")"
```

Syntax of defining entities is also similar to that in CL:

```
Definition = "(" Entity Name Value {Value} ")"
```

But the following way of explicitly handling scopes is different:

```
Binding = "(" Scope "(" Definition {Definition} ")" ")"
```

Main forms:

```
"(" "let" "(" Binding {Binding} ")" Body ")"
"(" "set" Binding {Binding} ")"
```


Future plans
------------

* Processing parameters
* Bundler plugins
* Signal system
* Object system
* ...
