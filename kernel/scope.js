const _ = require ('lodash')
class Scope {
    constructor (block) {
        this.block = block
        this.binding = {}
    }
    check (entity) {
        const Entity = require ('./entity')
        if (! _.includes (Entity.order.scope, entity)) {
            let error = new Error (`bad entity ${ entity }`)
            throw error
        }
    }
    get (entity, name) {
        this.check (entity)
        if (! (entity in this.binding)) {
            return undefined
        }
        return this.binding [entity] [name]
    }
    set (entity, name, thing) {
        this.check (entity)
        if (! (entity in this.binding)) {
            this.binding [entity] = {}
        }
        return this.binding [entity] [name] = thing
    }
}
class Dynamic extends Scope {
    ifOwnBinding (entity, name, yes, no) {
        if (entity in this.binding && name in this.binding [entity]) {
            return yes ()
        } else if (! this.block.base) {
            return yes ()
        } else {
            return no (this.block.base.scope)
        }
    }
    get (entity, name) {
        return this.ifOwnBinding (entity, name,
            () => {
                return super.get (entity, name)
            },
            (baseScope) => {
                return baseScope.dynamic.get (entity, name)
            }
        )
    }
    set (entity, name, thing) {
        return this.ifOwnBinding (entity, name,
            () => {
                return super.set (entity, name, thing)
            },
            (baseScope) => {
                //console.log ('[scope] base dynamic set', entity, name, thing)
                return baseScope.dynamic.set (entity, name, thing)
            }
        )
    }
}
class Lexical extends Scope {
    get (entity, name) {
        const thing = super.get (entity, name)
        if (! _.isUndefined (thing)) {
            return thing
        }
        if (this.block.base) {
            return this.block.base.scope.lexical.get (entity, name)
        }
    }
    integrate (scope) {
        //console.log ('[scope] integrate...')
        _.forEach (scope.binding, (binding, entity) => {
            if (! (entity in this.binding)) {
                this.binding [entity] = {}
            }
            _.forEach (binding, (thing, name) => {
                //console.log ('[scope] integrate', entity, name, thing)
                this.block.scope.lexical.set (entity, name, thing)
            })
        })
        if (scope.block.base) {
            this.integrate (scope.block.base.scope.lexical)
        }
        //console.log ('[scope] /integrate')
    }
}
module.exports = {
    model: {
        dynamic: Dynamic,
        lexical: Lexical,
    },
    order: [
        'dynamic', 'lexical'
    ]
}
