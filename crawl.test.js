import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl";

test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slashes', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})


test('getURLsFromHTML', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/">
                Boot.dev
            </a>
        </body>
    </html>`
    const inputBaseUrl = "https://blog.boot.dev/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseUrl)
    const expected = ['https://blog.boot.dev/']
    expect(actual).toEqual(expected)
})


test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">
                Boot.dev
            </a>
        </body>
    </html>`
    const inputBaseUrl = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseUrl)
    const expected = ['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})


test('getURLsFromHTML relative paths', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path1/">
                Boot.dev path one
            </a>
            <a href="/path2/">
                Boot.dev path two
            </a>
        </body>
    </html>`
    const inputBaseUrl = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseUrl)
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/']
    expect(actual).toEqual(expected)
})


test('getURLsFromHTML invalid', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">
                Invalid
            </a>
        </body>
    </html>`
    const inputBaseUrl = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseUrl)
    const expected = []
    expect(actual).toEqual(expected)
})