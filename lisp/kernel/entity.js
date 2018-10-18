const _ = require ('lodash')
class Datum {
    constructor () {
        [ this.name, this.body ] = arguments
    }
    evaluate () {
        return this.body
    }
}
class Callable extends Datum {
    constructor () {
        super (...arguments)
        if (! _.isFunction (this.body)) {
            console.log (this)
            throw new Error (`bad callable ${ this }`)
        }
    }
    evaluate (computer) {
        return this.body.call (computer)
    }
}
class Symbol extends Callable {
    inspect () {
        return `<S:${ _.toUpper (this.name) }>`
    }
}
class Macro extends Callable {
    inspect () {
        return `<M:${ _.toUpper (this.name) }>`
    }
    evaluate (computer, parameter) {
        return this.body.apply (computer, parameter)
    }
}
class Lambda extends Macro {
    inspect () {
        return `<F:${ _.toUpper (this.name) }>`
    }
    evaluate (computer, parameter) {
        return super.evaluate (computer, _.map (parameter, computer.evaluate.bind (computer)))
    }
}
module.exports = { 
    datum: Datum,
    callable: Callable,
    symbol: Symbol,
    macro: Macro,
    lambda: Lambda,
    computeOrder: [ 'macro', 'lambda', 'symbol', 'datum' ]
}
