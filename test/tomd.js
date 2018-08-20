const TurndownService = require('turndown')
const test = require('ava')

test('tomd', async (t) => {
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown('<h1>Hello world!</h1>')
    console.log(markdown)
    t.true(markdown != null)
})