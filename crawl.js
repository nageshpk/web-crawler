import { JSDOM } from 'jsdom';


async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
    const baseUrlObj = new URL(baseURL)
    const currentUrlObj = new URL(currentURL)
    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        return pages
    }

    const normalCurrentUrl = normalizeURL(currentURL)
    if (pages[normalCurrentUrl] > 0) {
        pages[normalCurrentUrl]++
        return pages
    }
    pages[normalCurrentUrl] = 1

    console.log(`crawling page: ${currentURL}`)
    let html = ''

    try{
        html = await getHTML(currentURL)
    } catch(err) {
        console.log(`${err.message}`)
        return pages
    }

    const nextUrls = getURLsFromHTML(html, baseURL)
    for(const nextUrl of nextUrls) {
        pages = await crawlPage(baseURL, nextUrl, pages)
    }

    return pages
}


//     try {
//         const response = await fetch(currentURL)
//         console.log(`crawling page: ${currentURL}...`)
//         if (response.status > 399) {
//             console.log(`error in fetch with status code: ${response.status} on page: ${currentURL}`)
//             return pages
//         }
    
//         const contentType = response.headers.get('content-type')
//         if (!contentType.includes('text/html')) {
//             console.log(`non html response, content type: ${contentType} on page: ${currentURL}`)
//             return pages
//         }
//         const htmlBody = await response.text()
//         const nextUrls = getURLsFromHTML(htmlBody, baseURL)

//         for (const nextUrl of nextUrls) {
//             pages = await crawlPage(baseURL, nextUrl, pages)
//         }

//     } catch(err) {
//         console.log(`error in fetch: ${err.message} on page: ${currentURL}`)
//     }
//     return pages
// }


async function getHTML(url) {
    let response
    try {
        response = await fetch(url)
    } catch(err) {
        throw new Error(`Got network error: ${err.message}`)
    }

    if (response.status > 399) {
        throw new Error(`Got HTTP error: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
        throw new Error(`Got non-HTML repsonse: ${contentType}`)
    }

    return response.text()
}


function normalizeURL(urlstring) {
    const urlObj = new URL(urlstring)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    // console.log(hostPath)
    // console.log(urlObj.hostname)
    // console.log(urlObj.pathname)
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}


function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')
    for (const link of links) {
        if (link.href.slice(0, 1) === '/') {
            try {
                const urlObj = new URL(`${baseURL}${link.href}`)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with relative url: ${err.message}`)
            }
        } else {
            try {
                const urlObj = new URL(link.href, baseURL)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with absolute url: ${err.message} at ${link.href}`)
            }
        }
    }
    return urls
}


export { normalizeURL, getURLsFromHTML, crawlPage };