import React, { Component, Fragment } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'

import { Typography } from '@material-ui/core'
import LocalPlayer from '../components/LocalPlayer'
import RemotePlayer from '../components/RemotePlayer'

const playerTheme = (mainTheme) => createMuiTheme({
    palette: {
        primary: mainTheme.palette.secondary,
        secondary: mainTheme.palette.primary,
        type: 'dark',
    },
    overrides: {
        MuiLinearProgress: {
            colorSecondary: {
                backgroundColor: 'transparent'
            }
        }
    }
})

@inject('playerStore')
@observer
class PlayerView extends Component {
    render() {
        const { playerStore: { device } } = this.props

        return (
            <MuiThemeProvider theme={playerTheme}>
                <div className="player__screen">
                    {!device && <Typography align="center" variant="h4">
                        Waiting for video to be ready
                    </Typography>}
                    {device &&
                        <Fragment>
                            {device.isLocal() && <LocalPlayer />}
                            {!device.isLocal() && <RemotePlayer />}
                        </Fragment>
                    }
                </div>
            </MuiThemeProvider>
        )
    }
}

PlayerView.propTypes = {
    playerStore: PropTypes.object
}

export default PlayerView