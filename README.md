((( All You Need Is Lisp )))
============================

`λ.λ`


Overview
--------

This framework turns your Node into a virtual lisp machine.


Usage
-----

#### 1. Test

```bash
$ npm start
```

#### 2. Apply

```javascript
require ('aynil') (__dirname + '/test/hello-world.lisp')
```

#### 3. Enjoy

```lisp
(set (lexical (datum hi "Hello")
	          (lambda say-hi (target)
		        (+ hi ", " target "!"))))
(say-hi "world")
```


Documentation
-------------

### Integration

You may `require` application-specific and vendor lisp source files
which are located either absolutely and relatively to the current code.
The following two expressions are equal:

```lisp
(require (+ *dirname* "/component.lisp"))
(require "./component.lisp")
```

As well, you may `require` into your lisp runtime
either application-specific JavaScript files or any node modules:

```lisp
(set (dynamic (datum _ (require "lodash" :js))))
(+ 2 3 4
   (call (. _ :sum)
	     (list 10 11 12)))
```

### The Dialect

#### Parameter

Common Lisp style of formal parameter definition is supported.
You may use special tokens `&optional`, `&key` and `&rest`.

In CL if you define both `&key` and `&rest` parameters,
you always get the keys included into rest.
However, this framework supports more user-friendly behaviour.
The parameters are processed exactly as you define:

```lisp
```

#### Binding

Atomic entities' (`Quote`, `Key`, `Datum` and `Symbol`)
value definition consists of a single expression.
Entities that accept call arguments (`Macro` and `Lambda`) 
take the first definition form as the formal parameter,
while rest forms are evaluated as the call result.
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


### Kernel Concepts

#### Entity

The entities support different evaluation strategies:

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


Future Plans
------------

* Bundler plugins
* Signal system
* Object system
* ...
* *PROFIT!!!!!!!*


Change Log
----------

#### v.0.8.0

* Support `&optional` and `&key` parameters for `Lambda`.

#### v.0.7.0

* Add conditional macros: `if`, `when`, `unless`.
* Support symbol `&rest` for parameter.


Licence
-------

Copyright &copy; 2018
[Dmytro Pinskyi](http://neverblued.info/)
<[lisp@neverblued.info](mailto:lisp@neverblued.info)>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
copy and run the Software,
and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
