const _ = require ('lodash')
class entity {
    constructor () {
        [ this.name, this.lambda ] = arguments
    }
}
class macro extends entity {
    inspect () {
        return `<M:${ _.toUpper (this.name) }>`
    }
    trigger (environment, parameters) {
        return this.lambda.apply (environment, parameters)
    }
}
class func extends entity {
    inspect () {
        return `<F:${ _.toUpper (this.name) }>`
    }
    trigger (environment, parameters) {
        const evaluate = environment.evaluate.bind (environment)
        return this.lambda.apply (environment, _.map (parameters, evaluate))
    }
}
module.exports = { entity, macro, func }
