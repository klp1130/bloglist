const listHelper = require('../utils/list_helper')

// Dummy
test('dummy returns on', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

