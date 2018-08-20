// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    extends: 'airbnb-base',
    rules: {
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        'no-alert': 1,
        'semi': 0,
        'no-mixed-operators': 0,
        'import/no-dynamic-require': 0,
        'no-unused-vars': 1,
        'func-names': 0,
        'no-unused-expressions': ['error', {
            allowTernary: true,
        }],
        'no-eval': 1,
        'new-cap': ['error', {
            capIsNew: false,
            properties: false
        }],
        'indent': ['error', 4, {
            SwitchCase: 1,
        }],
        'max-len': ['error', 260, 4],
        'no-param-reassign': ['error', { props: false }],
        'no-new-func': 0,
        'space-before-function-paren': 0,
        'global-require': 1,
        'no-underscore-dangle': 0,
        'class-methods-use-this': 1,
        'newline-per-chained-call': 0,
        'prefer-destructuring': 1,
        'no-await-in-loop': 0,
        'no-restricted-syntax': 0,
        'camelcase': 0
    }
}