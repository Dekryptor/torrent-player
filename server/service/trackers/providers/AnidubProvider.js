const DataLifeProvider = require('./DataLIfeProvider')
const urlencode = require('urlencode')
const $ = require('cheerio')

class AnidubProvider extends DataLifeProvider {
    constructor() {
        super({
            baseUrl: 'https://online.anidub.com',
            searchUrl: 'https://online.anidub.com/index.php?do=search',
            scope: '.newstitle',
            pageSize: 50,
            selectors: {
                id: { selector: '.title>a', transform: ($el) => urlencode($el.attr('href')) },
                name: '.title>a'
            },
            detailsScope: '#dle-content',
            detailsSelectors: {
                image: { 
                    selector: '.poster_img>img', 
                    transform: ($el) => $el.attr('src') 
                },
                description: { 
                    selector: '.maincont>ul>li',
                    transform: ($el) => {
                        return $el.toArray()
                            .map((node) => $(node).text())
                            .map((text) => {
                                const parts = text.split(':')
                                
                                if(parts.lenght < 2) return

                                const name = parts[0]
                                const value = parts.slice(1).join().trimLeft().replace(/\n+/, '')

                                return { name, value }
                            })
                            .filter((item) => item && item.name && item.value)
                    } 
                },
                files: {
                    selector: '.players>div:first-child select>option',
                    transform: ($el) => 
                        $el.toArray()
                            .map((node, index) => {
                                const $node = $(node)
                                const playerUrl = $node.attr('value').split('|')[0] 
                                const type = playerUrl.indexOf('sibnet') != -1 ?
                                    'sibnet' :
                                    'stormTv'

                                return {
                                    index,
                                    id: index,
                                    name: $node.text(),
                                    url: `/extractVideo?type=${type}&url=${urlencode(playerUrl)}`
                                }
                            })
                }
            }
        })
    }

    getName() {
        return 'anidub'
    }
}

module.exports = AnidubProvider