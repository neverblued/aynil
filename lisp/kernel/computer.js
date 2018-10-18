const _ = require ('lodash')
const Entity = require ('./entity')
const Scope = require ('./scope')
class Computer {
    constructor () {
        this.scope = {}
        _.forEach (Scope.computeOrder, scope => {
            this.scope [scope] = new (Scope [scope])
        })
    }
    set (scope, entity, name, body) {
        if (! (scope in this.scope)) {
            throw new Error (`bad scope "${ scope }"`)
        }
        if (! (entity in Entity)) {
            throw new Error (`bad entity "${ entity }"`)
        }
        const object = new (Entity [entity]) (name, body)
        this.scope [scope] .set (entity, name, object)
    }
    get (scope, entity, name) {
        if (! (scope in this.scope)) {
            throw new Error (`bad scope "${ scope }"`)
        }
        if (! (entity in Entity)) {
            throw new Error (`bad entity "${ entity }"`)
        }
        return this.scope [scope] .get (entity, name)
    }
//    stack () {
//        let stack = [ this ]
//        _.forEach (this.imports, source => {
//            stack = _.concat (stack, source.stack ())
//        })
//        return stack
//    }
    evaluate (value) {
//        console.log ('- evaluate', value)
        if (_.isArray (value)) {
            const [ name, ...parameter ] = value
            let callable
            _.some (Scope.computeOrder, scope => {
                return _.some (Entity.computeOrder, entity => {
                    callable = this.scope [scope] .get (entity, name)
                    if (callable) {
                        return true
                    }
                })
            })
            if (! (callable instanceof Entity.callable)) {
                throw new Error (`bad call "${ _.toUpper (name) }" typeof ${ typeof callable } = ${ callable }`)
            }
            return callable.evaluate (this, parameter)
        } else {
            if (value.length > 2 && value [0] === '"' && value [value.length - 1] === '"') {
                return value.substr (1, value.length - 2)
            }
            const number = _.toNumber (value)
            if (! _.isNaN (number)) {
                return number
            }
            const name = value
            let datum
            _.some (Scope.computeOrder, scope => {
                return _.some (Entity.computeOrder, entity => {
                    datum = this.scope [scope] .get (entity, name)
                    if (datum) {
                        return true
                    }
                })
            })
            if (! (datum instanceof Entity.datum)) {
                throw new Error (`bad datum "${ _.toUpper (name) }" typeof ${ typeof datum } = ${ datum }`)
            }
            return datum.evaluate (this)
        }
    }
    adapt (parameter) {
        // TODO
    }
    closure (callback) {
        callback.call (this)
    }
}
module.exports = Computer
