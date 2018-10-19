const _ = require ('lodash')
const Entity = require ('./entity')
const Block = require ('./block')
const Scope = require ('./scope')
class Computer {
    constructor () {
        this.block = new Block ()
    }
    set (scope, entity, name, body) {
        this.block.set (scope, entity, name, body)
    }
    get (scope, entity, name, body) {
        this.block.get (scope, entity, name, body)
    }
//    stack (callback) {
//        const root = this.block
//        const block = new Block (root)
//        block.root = root
//        this.block = block
//        callback.call (this)
//        this.block = root
//    }
    evaluate (value) {
        return this.block.evaluate (value)
    }
    adapt (parameter) {
        // TODO
    }
//    stack () {
//        let stack = [ this ]
//        _.forEach (this.imports, source => {
//            stack = _.concat (stack, source.stack ())
//        })
//        return stack
//    }
}
module.exports = Computer
