const _ = require ('lodash')
const Scope = require ('./scope')
class Entity {
    constructor (block) {
        this.block = block
    }
    inspect () {
        return this.toString ()
    }
}
class Key extends Entity {
    constructor (block, name) {
        super (block)
        this.name = name
    }
    evaluate () {
        return this
    }
    toString () {
        return `<K:${ _.toUpper (this.name) }>`
    }
}
class Datum extends Key {
    constructor (block, name, body) {
        super (block, name)
        if (! _.isUndefined (body)) {
            this.body = block.evaluate (body)
        }
    }
    evaluate () {
        return this.body
    }
    toString () {
        return `<D:${ _.toUpper (this.name) }>`
    }
}
class Symbol extends Datum {
    constructor (block, name, body) {
        super (block, name)
        this.body = body
    }
    evaluate (block) {
        return block.evaluate (this.body)
    }
    toString () {
        return `<S:${ _.toUpper (this.name) }>`
    }
}
class Callable extends Symbol {
    evaluate (block) {
        if (_.isFunction (this.body)) {
            return this.body.call (block)
        } else {
            return block.evaluate (this.body)
        }
    }
    toString () {
        return `<C:${ _.toUpper (this.name) }>`
    }
}
class Macro extends Callable {
    constructor (block, name, parameter, body) {
        super (block, name, body)
        this.parameter = parameter
    }
    evaluate (block, parameter) {
        if (_.isFunction (this.body)) {
            return this.body.call (block, ...parameter)
        } else {
            _.forEach (this.parameter, (name, index) => {
                block.set ('lexical', 'datum', name, parameter [index])
            })
            return block.evaluate (this.body)
        }
    }
    toString () {
        return `<M:${ _.toUpper (this.name) }>`
    }
}
class Lambda extends Macro {
    constructor (block, name, parameter, body) {
        super (block, name, parameter, body)
    }
    evaluate (block, parameter) {
        return block.stack (block => {
            block.scope.lexical.integrate (this.block.scope.lexical)
            if (_.isFunction (this.body)) {
                parameter = _.map (parameter, value => {
                    return block.evaluate (value)
                })
                return this.body.call (block, ...parameter)
            } else {
                _.forEach (this.parameter, (name, index) => {
                    const value = parameter [index]
                    //console.log ('[lambda] bind parameter', index, name, value)
                    block.set ('lexical', 'datum', name, value)
                })
                return block.evaluate (this.body)
            }
        })
    }
    toString () {
        return `<L:${ _.toUpper (this.name) }>`
    }
}
module.exports = {
    model: {
        entity: Entity,
        key: Key,
        datum: Datum,
        symbol: Symbol,
        callable: Callable,
        macro: Macro,
        lambda: Lambda,
    },
    order: {
        evaluate: {
            atom: [ 'macro', 'lambda', 'symbol', 'datum' ],
            list: [ 'macro', 'lambda' ],
        },
        scope: [
            'symbol', 'datum', 'macro', 'lambda'
        ],
    },
}
