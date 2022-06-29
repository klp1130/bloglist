const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
    const result = result('a')

    expect(result).toBe('a')
})

test('reverse of react', () => {
    const result = reverse('react')

    expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
    const result = reverse('re;eve;er')

    expect(result).toBe('releveler')
})