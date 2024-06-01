import { sortPages } from './report.js';
import { test, expect } from '@jest/globals';


test('sortPages', () => {
    const input = {
        url1: 5,
        url3: 2,
        url4: 10,
        url2: 8,
    }
    const actual = sortPages(input)
    const expected = [
        ['url4', 10],
        ['url2', 8],
        ['url1', 5],
        ['url3', 2]
    ]
    expect(actual).toEqual(expected)
})


test('sortPages null case', () => {
    const input = {}
    const actual = sortPages(input)
    const expected = []
    expect(actual).toEqual(expected)
})