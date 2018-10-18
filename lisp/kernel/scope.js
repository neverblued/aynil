const _ = require ('lodash')
const Entity = require ('./entity')
class Scope {
    constructor (node) {
        this.node = node
        this.binding = {}
        _.forEach (Entity.computeOrder, entity => {
            this.binding [entity] = {}
        })
    }
    get (entity, name) {
        return this.binding [entity] [name]
    }
    set (entity, name, object) {
        this.binding [entity] [name] = object
    }
}
class Dynamic extends Scope {
}
class Lexical extends Scope {
}
module.exports = { 
    dynamic: Dynamic,
    lexical: Lexical,
    computeOrder: [ 'lexical', 'dynamic' ]
}
