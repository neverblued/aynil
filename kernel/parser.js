const _ = require ('lodash')
const placeholder = {
    dongle: id => `#DONGLE:${ id }#`,
}
const template = {
    comment: new RegExp (';.*$', 'mg'),
    dongle: new RegExp (`^${ placeholder.dongle ('(\\d+)') }$`),
    string: new RegExp ('"([^"]*?)"'),
    space: new RegExp ('[\\n\\t\\s]+', 'g'),
    token: new RegExp ('[\\(\\)]|[^\\n\\t\\s\\(\\)]+', 'g'),
}
const snippetLength = 42
module.exports = {
    read (code) {
        const strings = {}
        let stringIndex = 0
        while (true) {
            const match = code.match (template.string)
            if (! match) {
                break
            }
            const [ token ] = match
            const before = code.substr (0, match.index)
            const after = code.substr (match.index + token.length)
            code = before + placeholder.dongle (stringIndex) + after
            strings [_.toString (stringIndex)] = token
            stringIndex ++
        }
        code = code.replace (template.comment, '')
        code = code.replace (template.space, ' ')
        const tokens = code.match (template.token)
        return _.map (tokens, token => {
            const match = token.match (template.dongle)
            if (! match) {
                return token
            }
            const index = match [1]
            return strings [index]
        })
    },
    interpret (tokens) {
        const tree = [ 'result' ]
        const nodes = []
        let node = tree
        let branch
        while (tokens.length) {
            const token = tokens.shift ()
            switch (token) {
                case '(':
                    branch = []
                    node.push (branch)
                    nodes.push (node)
                    node = branch
                    break
                case ')':
                    node = nodes.pop ()
                    if (! node) {
                        const code = tokens.join (' ') .substr (0, snippetLength)
                        let error = new Error (`syntax error before "${ code }"`)
                        throw error
                    }
                    break
                default:
                    node.push (token)
            }
        }
        return tree
    },
}
