import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Fullscreen from 'react-full-screen'
import MediaControls from './MediaControls'
import PlayerFilesList from './PlayerPlayList'
import PlayerTitle from './PlayerTitle'
import VideoScrean from './VideoScrean'

import { Typography, CircularProgress } from '@material-ui/core'
import { observer } from 'mobx-react'

import { isMobile, isTablet } from '../utils'

const IDLE_TIMEOUT = 3000

@observer
class LocalPlayer extends Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            playlistOpen: false,
            idle: false,
            fullScreen: false
        }

        this.handleActivity = this.handleActivity.bind(this)
    }

    handleTogglePlayList = () => {
        this.setState((prevState) => ({
            playlistOpen: !prevState.playlistOpen
        }))
    }

    handleIdle = (idle) => {
        this.setState({ idle })
    }

    handleSelectFile = (fileIndex) => {
        const { playerStore } = this.props
        playerStore.switchFile(fileIndex)

        if (isMobile()) this.setState({ playlistOpen: false })
    }

    handleToggleFullscreen = () => {
        const fullScreen = !this.state.fullScreen
        this.setState({ fullScreen })
    }

    handleSetFullScreen = (fullScreen) => {
        this.setState({ fullScreen })
        if (fullScreen) this.setState({ idle: true })
    }

    // --- idle checking ---
    handleActivity = () => {
        const { state: { idle }, idleTimeout } = this

        clearTimeout(idleTimeout)
        this.setIdleTimeout()

        if (idle) this.setState({ idle: false })
    }

    setIdleTimeout() {
        this.idleTimeout = setTimeout(
            () => this.setState({ idle: true }),
            IDLE_TIMEOUT
        )
    }

    componentWillUnmount() {
        const { idleTimeout } = this
        clearTimeout(idleTimeout);

        ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(
            (event) => window.removeEventListener(event, this.handleActivity)
        )
    }

    componentDidMount() {
        this.setIdleTimeout();

        ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(
            (event) => window.addEventListener(event, this.handleActivity)
        )
    }
    // --- idle checking ---

    render() {
        const { playerStore } = this.props
        const { playlistOpen, idle, fullScreen } = this.state
        const { device } = playerStore
        const { isLoading, error } = device

        const showTitle = !(isTablet() && playlistOpen)

        return (
            <Fullscreen
                enabled={fullScreen}
                onChange={this.handleSetFullScreen}
            >
                <div style={{ visibility: error ? 'hidden' : 'initial' }}>
                    <VideoScrean device={device} onEnded={playerStore.nextFile} />
                </div>
                {isLoading && <div className="loading-center"><CircularProgress /></div>}
                {error && <Typography align="center" variant="display1">{error}</Typography>}
                {(!idle || !fullScreen) && (
                    <Fragment>
                        {showTitle && <PlayerTitle title={device.playlist.name} onClose={() => playerStore.closePlaylist()} />}
                        <PlayerFilesList
                            open={playlistOpen}
                            device={device}
                            onFileSelected={this.handleSelectFile}
                        />
                        <MediaControls
                            fullScreen={fullScreen}
                            device={device}
                            onNext={() => playerStore.nextFile()}
                            onPrev={() => playerStore.prevFile()}
                            onPlaylistToggle={this.handleTogglePlayList}
                            onFullScreenToggle={this.handleToggleFullscreen}
                        />
                    </Fragment>
                )}
            </Fullscreen >
        )
    }
}

LocalPlayer.propTypes = {
    playerStore: PropTypes.object.isRequired
}

export default LocalPlayer