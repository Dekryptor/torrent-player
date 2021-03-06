import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { indigo } from '@material-ui/core/colors'
import { 
    Search as SearchIcon,
    ListRounded as LibraryIcon,
    Airplay as CastScreanIcon,
    Input as ConnectIcon
} from '@material-ui/icons'
import { isMobile } from '../utils'

const navBarTheme = (mainTheme) => createMuiTheme({
    palette: {
        primary: {
            main: indigo[300]
        },
        secondary: mainTheme.palette.secondary,
        type: 'dark',
    }
})

class MainNavigation extends Component {

    handleChange = (_, value) => {
        const { goToScreen } = this.props
        if (typeof value == 'function')
            value()
        else
            goToScreen(value)
    }

    handleConnect = () => this.props.onConnect()

    render() {
        const { screen, isCastAvaliable } = this.props
        const mobile = isMobile()

        return (
            <MuiThemeProvider theme={navBarTheme}>
                <BottomNavigation
                    showLabels={!mobile} className="main-navigation"
                    value={screen}
                    onChange={this.handleChange}
                >
                    <BottomNavigationAction value="search" label="Search" icon={<SearchIcon />} />
                    <BottomNavigationAction value="library" label="Library" icon={<LibraryIcon />} />
                    { isCastAvaliable && <BottomNavigationAction value="cast-screan" label="Cast Screan" icon={<CastScreanIcon />} /> }
                    <BottomNavigationAction value={this.handleConnect} label="Connect" icon={<ConnectIcon />} />
                </BottomNavigation>
            </MuiThemeProvider>
        )
    }
}

MainNavigation.propTypes = {
    screen: PropTypes.string.isRequired,
    isCastAvaliable: PropTypes.bool,
    onConnect: PropTypes.func.isRequired,
    goToScreen: PropTypes.func.isRequired
}

export default MainNavigation