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

* `Lexical` — from source code topology
* `Dynamic` — from execution history

You may define bindings in both scopes using both methods `let` and `set`.
Method `let` has a body for code where the bindings should be usable
and creates a new `Block` on the stack.
The `set` method has no "body" and consumes the closest outer stack `Block`.

#### Entity

* `Key` — evaluates to itself
* `Datum` — evaluates in the declaration environment
* `Symbol` — may be called and evaluates in the call environment
* `Lambda` — accepts evaluated call parameters and creates a lexical closure
* `Macro` — parameters may be evaluated manually and no closure is created

#### Binding

Value definition of atomic entities (`Quote`, `Key`, `Datum` and `Symbol`) 
consists of a single expression.
Entities that accept call arguments (`Macro` and `Lambda`) 
take the first definition argument as self parameters,
while rest code forms the call result.
This is similar to Common Lisp:

```
Value = "(" ( Body | Parameter Body {Body} ) ")"
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
