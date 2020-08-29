/* The Material-UI theme can be easily customized using the ThemeProvider component. It can also be used to configure the custom values of theme variables in
createMuiTheme(). We will define a custom theme for the skeleton application using createMuiTheme, and then export it so that it can be used in the App component.
For the skeleton, we only apply minimal customization by setting some color values to be used in the UI. The theme variables that are generated here will be passed to,
and available in, all the components we build.
*/

import { createMuiTheme } from '@material-ui/core/styles'
//import { pink } from '@material-ui/core/colors'
import { teal, orange } from '@material-ui/core/colors'

/* const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
        light: '#5c67a3',
        main: '#3f4771',
        dark: '#2e355b',
        contrastText: '#fff',
    },
    secondary: {
        light: '#ff79b0',
        main: '#ff4081',
        dark: '#c60055',
        contrastText: '#000',
    },
    openTitle: '#3f4771',
    protectedTitle: pink['400'],
    type: 'light'
    }
}) */

const theme = createMuiTheme({
    palette: {
        primary: {
        light: '#52c7b8',
        main: '#009688',
        dark: '#00675b',
        contrastText: '#fff',
    },
    secondary: {
        light: '#ffd95b',
        main: '#ffa726',
        dark: '#c77800',
        contrastText: '#000',
    },
        openTitle: teal['700'],
        protectedTitle: orange['700'],
        type: 'light'
    }
})

export default theme