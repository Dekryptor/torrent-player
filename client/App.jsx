import './styles.scss'
import { hot } from 'react-hot-loader'
import React, { Component } from 'react'
import Root from './Root'
import { 
    MuiThemeProvider, 
    createMuiTheme
} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import './store/remote-control'
// import DevTools from 'mobx-react-devtools'

import stores from './store'
import { Provider } from 'mobx-react'

const theme = createMuiTheme({
    palette: {
        secondary: {
            light: red.A200,
            main: red[500],
            dark: red[900],
            contrastText: '#fff'
        }
    },
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiListItemIcon: {
            root: {
                marginRight: 0
            }
        },
        MuiListItemText: {
            root: {
                padding: '0 5px 0 16px'
            }
        }
    }
})

class App extends Component {
    render() {
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <Provider {...stores}>
                        <Root />
                    </Provider>
                </MuiThemeProvider>
                {/* <DevTools /> */}
            </div>
        )
    }
}

export default hot(module)(App)