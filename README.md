((( LispingOut )))
==================

Proud to have
[sexps](https://en.wikipedia.org/wiki/S-expression "S-expression")
the right way!
`λ.λ`


Get Started
-----------

#### Test

```bash
$ npm start
```

#### Apply

```javascript
require ('lispingout') (__dirname + '/test/hello-world.lisp')
```

#### Enjoy

```lisp
(let ((lexical (datum hi "Hello")
               (lambda say-hi (name)
                 (+ hi ", " name "!"))))
  (say-hi "world"))
```


Usage Tips
----------

### Integration

You may `require` application-specific and vendor lisp source files
which are located either absolutely and relatively to the current code.
The following two expressions are equal:

```lisp
(require (+ *dirname* "/component.lisp"))
(require "./component.lisp")
```

As well you may transparently `require` into your lisp
either local JavaScript files or any node modules:

```lisp
(set (dynamic (datum _ (require "lodash" :js))))
(+ 2 3 4
   (call (. _ :sum)
	     (list 10 11 12)))
```


### Model

#### Entity

Entities support different evaluation strategies:

* `Quote` — does not evaluate
* `Key` — evaluates to itself
* `Datum` — evaluates in the declaration environment
* `Symbol` — evaluates in the call environment
* `Lambda` — accepts evaluated call arguments and creates a lexical closure
* `Macro` — arguments may be evaluated manually and no closure is created

Entities form two groups by their ability to execute:

* May execute — `Macro`, `Lambda` and `Symbol`
* Just hold value — `Datum` and `Key`

Entities also form two groups by their ability to take arguments
during execution:

* Take arguments — `Macro` and `Lambda` 
* Do not take — `Key`, `Datum` and `Symbol`


#### Scope

* `Lexical` — from source code topology
* `Dynamic` — from execution history

You may define bindings in both scopes using both methods `let` and `set`.

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

But the following explicit scope notation is different:

```
Binding = "(" Scope "(" Definition {Definition} ")" ")"
```

Main binding expressions syntax:

```
"(" "let" "(" Binding {Binding} ")" Body ")"
"(" "set" Binding {Binding} ")"
```

Macro `let` has a body for code where the bindings should be usable
and creates a new `Block` on the stack.
The `set` macro has no "body" and consumes the closest outer stack `Block`.


Future plans
------------

* Processing parameters
* Bundler plugins
* Signal system
* Object system
* ...
* *PROFIT!!!!!!!*


Licence
-------

TODO
