import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import TorrentListItem from '../components/TorrentListItem'
import DeleteDialog from '../components/DeleteDialog'
import BookmarkItem from '../components/BookmarkItem'

import {
    Grid,
    CircularProgress,
    Typography,
    TextField
} from '@material-ui/core'

import { observer, inject } from 'mobx-react'
import memoize from 'memoize-one'

const DeleteTorrentDialog = (props) => 
    <DeleteDialog 
        {...props}
        renderTitle={() => 'Delete torrent?'}
        renderText={(item) => `Do you want to delete torrent ${item.name} and all data?`}
    />

@inject('libraryStore', 'transitionStore') 
@observer
class LibraryView extends Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            torrentToDelete: null,
            filter: ''
        }
    }

    componentDidMount() {
        this.props.libraryStore.startUpdate()
    }

    componentWillUnmount() {
        this.props.libraryStore.stopUpdate()
    }

    handleFilterChange = (e) => this.setState({ filter: e.target.value })
    handleRemoveBookmark = (item) => this.props.libraryStore.removeBookmark(item)
    handleAskDeleteToprrent = (torrent) => this.setState({ torrentToDelete: torrent })
    handleRejectDeleteToprrent = () => this.setState({ torrentToDelete: null })
    handleAcceptDeleteToprrent = (torrent) => {
        const { libraryStore } = this.props
        this.setState({ torrentToDelete: null })
        libraryStore.deleteTorrent(torrent)
    }

    filterBookmarks = memoize((bookmarks, filter) => {
        if(filter == '') return bookmarks

        filter = filter.toLowerCase()
        return bookmarks.filter((bookmark) =>
            bookmark.playlist.name
                .toLowerCase()
                .search(filter) != -1
        )    
    })
    filterTorrents = memoize((torrents, filter) => {
        if(filter == '') return torrents

        filter = filter.toLowerCase()
        return torrents.filter((torrent) =>
            torrent.name
                .toLowerCase()
                .search(filter) != -1
        )    
    })

    renderBookmarks(bookmarks) {
        if(!bookmarks || bookmarks.length == 0) return

        const { transitionStore: { playMedia, openCastDialog }} = this.props

        return (
            <Fragment>
                <Typography variant="h6" className="library__title">
                    Continue Watching
                </Typography>
                {bookmarks.map((item) =>
                    <Grid item xs={12} key={item.playlist.name}>
                        <BookmarkItem item={item} 
                            onPlay={playMedia} 
                            onCast={openCastDialog}
                            onRemove={this.handleRemoveBookmark}
                        />
                    </Grid>
                )}
            </Fragment>
        )
    }

    renderTorrents(torrents) {
        if(!torrents || torrents.length == 0) return

        return (
            <Fragment>
                <Typography variant="h6" className="library__title">
                    Torrents
                </Typography>
                {torrents.map((torrent) =>
                    <Grid item xs={12} key={torrent.infoHash}>
                        <TorrentListItem torrent={torrent} onDelete={this.handleAskDeleteToprrent.bind(this)} />
                    </Grid>
                )}
            </Fragment>
        )
    }

    render() {
        const { libraryStore: { library: { torrents, bookmarks }, loading }} = this.props
        const { torrentToDelete, filter } = this.state
        
        const filteredBookmarks = this.filterBookmarks(bookmarks, filter)
        const filteredTorrets = this.filterTorrents(torrents, filter)

        const emptyLibrary = torrents.length == 0 && bookmarks.length == 0
        const noResults = filteredTorrets.length == 0 && filteredBookmarks.length == 0

        return (
            <div className="library">
                <Grid container spacing={16}>
                    {loading && <div className="center"><CircularProgress/></div>}
                    {!loading && 
                        <Fragment>
                            {!emptyLibrary && <Fragment>
                                <div className="library__filter">
                                    <TextField
                                        placeholder="Filter"
                                        value={filter}
                                        onChange={this.handleFilterChange}
                                        fullWidth
                                    />
                                </div>
                                {this.renderBookmarks(filteredBookmarks)}
                                {this.renderTorrents(filteredTorrets)}
                                {noResults && 
                                    <Typography className="center" align="center" variant="h4">
                                        No results
                                    </Typography>
                                }
                            </Fragment>}
                            {emptyLibrary && 
                                <Typography className="center" align="center" variant="h4">
                                    Library is empty
                                </Typography>
                            }
                        </Fragment>
                    }
                    <DeleteTorrentDialog
                        item={torrentToDelete}
                        onAccept={this.handleAcceptDeleteToprrent.bind(this)}
                        onReject={this.handleRejectDeleteToprrent.bind(this)}
                    />
                </Grid>
            </div>
        )
    }
}

LibraryView.propTypes = {
    libraryStore: PropTypes.object,
    transitionStore: PropTypes.object
}

export default LibraryView