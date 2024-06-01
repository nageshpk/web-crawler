import { crawlPage } from "./crawl.js"
import { printReport } from "./report.js"

async function main() {
    // console.log(process.argv)
    if (process.argv.length < 3) {
        console.log('no url provided')
        process.exit(1)
    } 
    if (process.argv.length > 3) {
        console.log('too many commands provided')
        process.exit(1)
    }
    const baseURL = process.argv[2]
    console.log(`Start crawl for page: ${baseURL}`)
    const pages = await crawlPage(baseURL)
    printReport(pages)
}

main()