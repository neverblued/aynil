const parser = require ('./kernel/parser')
const computer = new (require ('./kernel/computer'))
require ('./dialect') (computer)
module.exports = {
    parse (code) {
        return parser.interpret (parser.read (code))
    },
    compute (tree) {
        return computer.evaluate (tree)
    },
}
