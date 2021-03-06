const providers = [
    new (require('./providers/TfileProvider'))(),
    new (require('./providers/RutorProvider'))(),
    new (require('./providers/AnimeVostProvider'))(),
    new (require('./providers/AnidubProvider'))(),
    new (require('./providers/ColdFilmProvider'))(),
    new (require('./providers/FastTorrentsProvider'))(),
    ...require('./providers/RutrackerProvider').providers,
    ...require('./providers/NNMClubProvider').providers
]

module.exports = {
    getTrackers() {
        return providers.map((provider) => provider.getName())
    },
    getTracker(name) {
        const provider = providers.find((provider) => provider.getName() == name)
        if(provider) {
            return Promise.resolve(provider)
        }
        return Promise.reject(`No provider found for ${name}`)
    },
    search(tracker, query, page = 0, pageCount = 1) {
        return this.getTracker(tracker)
            .then((provider) => provider.search(query, page, pageCount))
    },
    getInfo(tracker, resultsId) {
        return this.getTracker(tracker)
            .then((provider) => provider.getInfo(resultsId))
    },
    loadTorentFile(tracker, torrentUrl) {
        return this.getTracker(tracker)
            .then((provider) => provider.loadTorentFile(torrentUrl))
    }
}