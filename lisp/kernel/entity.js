const _ = require ('lodash')
const Scope = require ('./scope')
class Datum {
    constructor (block, name, body) {
        this.block = block
        this.name = name
        this.body = body
        //console.log ('[entity] created datum', this.name, this.body)
    }
    evaluate () {
        return this.body
    }
    inspect () {
        return this.toString ()
    }
    toString () {
        return `<D:${ _.toUpper (this.name) }>`
    }
}
class Callable extends Datum {
}
class Symbol extends Callable {
    toString () {
        return `<S:${ _.toUpper (this.name) }>`
    }
    evaluate (block) {
        if (_.isFunction (this.body)) {
            return this.body.call (block)
        } else {
            return block.evaluate (this.body)
        }
    }
}
class Macro extends Callable {
    constructor (block, name, parameter, body) {
        super (block, name, body)
        this.parameter = parameter
        //console.log ('[entity] created macro', this.name, this.parameter, this.body)
    }
    toString () {
        return `<M:${ _.toUpper (this.name) }>`
    }
    evaluate (block, parameter) {
        //console.log ('[entity] macro evaluate', this.name, parameter)
        // TODO adapt this.parameter
        if (_.isFunction (this.body)) {
            return this.body.call (block, ...parameter)
        } else {
            return block.evaluate (this.body)
        }
    }
}
class Lambda extends Macro {
    constructor (block, name, parameter, body) {
        super (block, name, parameter, body)
        //console.log ('[entity] created lambda', this.name, this.parameter, this.body)
    }
    toString () {
        return `<L:${ _.toUpper (this.name) }>`
    }
    evaluate (block, parameter) {
        //console.log ('[entity] lambda evaluate', this.name, parameter, typeof this.body)
        return block.stack (block => {
            block.scope.lexical.integrate (this.block.scope.lexical)
            //console.log ('+2?++', block.scope.lexical)
            parameter = _.map (parameter, value => {
                return block.evaluate (value)
            })
            _.forEach (this.parameter, (name, index) => {
                block.set ('lexical', 'datum', name, parameter [index])
            })
            if (_.isFunction (this.body)) {
                return this.body.call (block, ...parameter)
            } else {
                return block.evaluate (this.body)
            }
        })
    }
}
module.exports = {
    model: {
        datum: Datum,
        callable: Callable,
        symbol: Symbol,
        macro: Macro,
        lambda: Lambda,
    },
    order: {
        evaluate: {
            atom: [ 'symbol', 'datum' ],
            list: [ 'macro', 'lambda' ],
        },
        scope: [
            'symbol', 'datum', 'macro', 'lambda'
        ],
    },
}
