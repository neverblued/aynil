FutuLisp
========

FutuLisp is a Lisp-on-JavaScript framework
ready for web development
while keeping it simply stupid.


Usage
-----

#### Install

```
npm i futulisp
```

#### Test

```
npm start
```

#### Require

```
require ('lisp') (__dirname + '/application.lisp')
```


Syntax
------

#### Binding

All bindings have explicit syntax:
```
Binding = Scope Entity Name Declaration {Declaration}
```

Depending on the entity,
one declaration item may represent a datum value or a symbol body.
In the case of complex callables,
first of the multiple declarations represents formal parameters
while rest is implicitly computed as a body of the called entity.

```
Declaration = Value | Body | Parameter Body {Body}
```

#### Scope

* Lexical
* Dynamic

#### Entity

* Key — evaluates to itself
* Datum — evaluates in the declaration environment
* Symbol — may be called and evaluates in the call environment
* Lambda — accepts evaluated call parameters and creates a lexical closure
* Macro — the parameters may be evaluated manually and no closure is created


P.S.
----

Future belongs to lispers!
