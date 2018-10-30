const expect = require ('chai') .expect
const lisp = require ('..')

describe ('((( All You Need Is Lisp )))', function () {
    [
        
        [
            'integration',
            [
                [ 'dirname', "*DIRNAME* as the source file's directory path" ],
                [ 'require-my-lisp', "requiring a local lisp source files" ],
                [ 'require-npm-js', "requiring JS files from a Node module" ],
            ],
        ],
        
        [
            'data processing',
            [
                [ 'uid', "generating unique ids" ],
                [ 'hashtable', "HASHTABLE via key symbols and the dot accessor" ],
                [ 'list', "LIST as the native array" ],
            ],
        ],
        
        [
            'logical and flow control',
            [
                [ 'boolean', "boolean values TRUE and FALSE" ],
                [ 'native-logic', "logic operations IF, AND, OR, NOT" ],
            ],
        ],
        
        [
            'parameter processing',
            [
                [ 'parameter-optional', "&OPTIONAL parameters" ],
                [ 'parameter-rest', "&REST parameters" ],
                [ 'parameter-key', "&KEY parameters" ],
                [ 'parameter-mixed', "&OPTIONAL, &REST and &KEY parameters mixed together" ],
                [ 'argument-lambda', "passing lambda as argument to native function" ],
                [ 'lexical-closure', "creating a lexical closure for lambda definition" ],
            ],
        ],
        
        [
            'evaluation',
            [
                [ 'evaluate', "EVALUATE" ],
                [ 'quote', "QUOTE" ],
                [ 'backquote-unquote', "BACKQUOTE and UNQUOTE" ],
                [ 'conditional', "lisp conditional macros WHEN, UNLESS, COND" ],
            ],
        ],
        
    ] .forEach (
        ([ group, suites ]) => {
            describe (`\n  - ${ group } features`, function () {
                suites.forEach (([ file, feature ]) => {
                    it (`support ${ feature }`, function () {
                        expect (lisp (`${ __dirname }/${ file }.lisp`)) .equal (true)
                    })
                })
            })
        }
    )
})
