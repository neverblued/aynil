const _ = require ('lodash')
const Entity = require ('./entity')
const Scope = require ('./scope')
class Block {
    constructor (base = null) {
        this.base = base
        this.scope = {}
        _.forEach (Scope.order, scope => {
            this.scope [scope] = new (Scope.model [scope]) (this)
        })
    }
    stack (callback) {
        //console.log ('[block] stack...')
        const block = new Block (this)
        const thing = callback (block)
        //console.log ('[block] stack =>', thing)
        return thing
    }
    closure (callback) {
        return this.stack (block => {
            block.scope.lexical.integrate (this.scope.lexical)
            const thing = callback (block)
            //console.log ('[block] closure =>', thing)
            return thing
        })
    }
    check (scope, entity) {
        if (! (scope in Scope.model)) {
            let error = new Error (`bad scope ${ scope }`)
            throw error
        }
        if (! (entity in Entity.model)) {
            let error = new Error (`bad entity ${ entity }`)
            throw error
        }
    }
    set (scope, entity, name, ...value) {
        this.check (scope, entity)
        const thing = new (Entity.model [entity]) (this, name, ...value)
        //console.log ('[block] set', scope, entity, name, '=>', thing)
        return this.scope [scope] .set (entity, name, thing)
    }
    get (scope, entity, name) {
        this.check (scope, entity)
        return this.scope [scope] .get (entity, name)
    }
    evaluate (value) {
        //console.log ('[block] evaluate', value, '..?!..')
        const thing = (() => {
            if (_.isUndefined (value)) {
                return undefined
                //let error = new Error (`undefined value`)
                //throw error
            } else if (_.isArray (value)) {
                const [ name, ...parameter ] = value
                return this.lookup ('list', 'callable', name) .evaluate (this, parameter)
            } else {
                if (value.length > 2 && value [0] === '"' && value [value.length - 1] === '"') {
                    return value.substr (1, value.length - 2)
                } else {
                    const number = _.toNumber (value)
                    if (! _.isNaN (number)) {
                        return number
                    } else {
                        const name = value
                        return this.lookup ('atom', 'datum', name) .evaluate (this)
                    }
                }
            }
        }) ()
        //console.log ('[block] evaluate', value, '=>', thing)
        return thing
    }
    lookup (order, model, name) {
        if (! (order in Entity.order.evaluate)) {
            let error = new Error (`bad order ${ order }`)
            throw error
        }
        let thing
        _.some (Scope.order, scope => {
            return _.some (Entity.order.evaluate [order], entity => {
                thing = this.scope [scope] .get (entity, name)
                if (thing) {
                    return true
                }
            })
        })
        if (! (thing instanceof Entity.model [model])) {
            const exhibit = `(typeof ${ typeof thing }) ${ thing }`
            let error = new Error (`bad ${ model } ${ name } => ${ exhibit }`)
            throw error
        }
        //console.log ('[block] lookup', order, model, name, '=>', thing)
        return thing
    }
}
module.exports = Block
