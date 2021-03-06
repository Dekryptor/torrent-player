const cheerio = require('cheerio')
const { URL } = require('url')
const superagent = require('superagent')

require('superagent-charset')(superagent)

class Crawler {
    constructor(url, requestGenerator) {
        this._requestGenerator = requestGenerator || (async (nextUrl) => {
            const targetUrl = nextUrl != this._url ? 
                new URL(nextUrl, this._url).toString() :
                nextUrl

            return superagent
                .get(targetUrl)
                .charset()
                .set(this._headers)
        })
        this._url = url
    }

    headers(headers) {
        this._headers = headers
        return this
    }

    scope(scope) {
        this._scope = scope
        return this
    }

    set(selectors) {
        this._selectors = selectors
        return this
    }

    paginate(pagenatorSelector) {
        this._pagenatorSelector = pagenatorSelector
        return this
    }

    limit(limit) {
        this._limit = limit
        return this
    }

    _extractData($el, config) {
        let transform = ($el) => $el.text().trim()
        let selector = config

        if (typeof selector !== 'string') {
            transform = config.transform
            selector = config.selector
        }

        $el = selector ? $el.find(selector) : $el

        return transform($el)
    }

    async gather() {
        if (!this._scope) {
            throw Error('No scope selected')
        }

        if (!this._selectors) {
            throw Error('No selectors set')
        }

        const results = []

        const step = async (currentUrl) => {
            const res = await this._requestGenerator(currentUrl)

            const $ = cheerio.load(res.text, { xmlMode: false })

            const nextUrl =
                this._pagenatorSelector &&
                $(this._pagenatorSelector).attr('href')

            let limitReached = false

            $(this._scope).each((_, el) => {
                const item = {}

                Object.keys(this._selectors).forEach(
                    (selectorName) => {
                        const selector = this._selectors[
                            selectorName
                        ]
                        item[selectorName] = this._extractData(
                            $(el),
                            selector
                        )
                    }
                )

                results.push(item)

                if (this._limit && results.length >= this._limit) {
                    limitReached = true
                    return false
                }
            })

            if (!nextUrl || limitReached) {
                return results.slice(0, this._limit)
            }

            return await step(nextUrl)
        }

        return await step(this._url)
    }
}

module.exports = {
    Crawler,
    get(url, requestGenerator) {
        return new Crawler(url, requestGenerator)
    }
}
