const _ = require ('lodash')
const debug = require ('debug') ('lisp-scope')

class Scope {
    
    constructor (environment) {
        this.environment = environment
        this.binding = {}
    }
    
    check (model) {
        const Expression = require ('./expression')
        if (! _.includes (Expression.order.scope, model)) {
            let error = new Error (`bad model ${ model }`)
            throw error
        }
    }
    
    get (model, name) {
        this.check (model)
        if (! (model in this.binding)) {
            return undefined
        }
        return this.binding [model] [name]
    }

    set (model, name, thing) {
        this.check (model)
        if (! (model in this.binding)) {
            this.binding [model] = {}
        }
        debug ('set: %s %s %o', model, name, thing)
        return this.binding [model] [name] = thing
    }
}

class Dynamic extends Scope {
    
    ifOwnBinding (model, name, yes, no) {
        if (model in this.binding && name in this.binding [model]) {
            return yes ()
        } else if (! this.environment.base) {
            return yes ()
        } else {
            return no (this.environment.base.scope)
        }
    }
    
    get (model, name) {
        return this.ifOwnBinding (
            model,
            name,
            () => {
                return super.get (model, name)
            },
            (baseScope) => {
                return baseScope.dynamic.get (model, name)
            }
        )
    }
    
    set (model, name, entity) {
        return this.ifOwnBinding (
            model, name,
            () => {
                return super.set (model, name, entity)
            },
            (baseScope) => {
                debug ('base dynamic set: %s %s %o', model, name, entity)
                return baseScope.dynamic.set (model, name, entity)
            }
        )
    }
}

class Lexical extends Scope {
    
    get (model, name) {
        const entity = super.get (model, name)
        if (! _.isUndefined (entity)) {
            return entity
        }
        if (this.environment.base) {
            return this.environment.base.scope.lexical.get (model, name)
        } else {
            return undefined
        }
    }
    
    integrate (scope) {
        debug ('\\ integrate')
        _.forEach (scope.binding, (binding, model) => {
            if (! (model in this.binding)) {
                this.binding [model] = {}
            }
            _.forEach (binding, (entity, name) => {
                debug ('integrate: %s %s %s', model, name, entity)
                this.environment.scope.lexical.set (model, name, entity)
            })
        })
        if (scope.environment.base) {
            this.integrate (scope.environment.base.scope.lexical)
        }
        debug ('/ integrate')
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
