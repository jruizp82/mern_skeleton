/* The top-level React component that will contain all the components for the application's frontend is defined here.
We configure the React app so that it renders the view components with a customized Material-UI theme, enables frontend routing, 
and ensures that the React Hot Loader can instantly load changes as we develop the components
*/

import React from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import { hot } from 'react-hot-loader'

const App = () => {
    /* Once the code that's been rendered on the server-side reaches the browser and the frontend script takes over, we need to remove the server-side injected CSS when the
    root React component mounts, using the useEffect hook.
    This will give back full control over rendering the React app to the client-side. To ensure this transfer happens efficiently, we need to update how the ReactDOM renders the views.
    */
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles)
        }
    }, [])    
    return (
        /* When defining this root component in App.js, we wrap the MainRouter component with ThemeProvider, which gives it access to the Material-UI theme,
        and BrowserRouter, which enables frontend routing with React Router. The custom theme variables we defined previously are passed as a prop to ThemeProvider,
        making the theme available in all our custom React components. 
        */
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <MainRouter/>
            </ThemeProvider>
        </BrowserRouter>
    )
}

/* Finally, in the App.js file, we need to export this App component so that it can be imported and used in main.js.
Marking the App component as hot in this way essentially enables live reloading of our React components during development.
For our MERN applications, we won't have to change the main.js and App.js code all that much after this point, and we can continue 
building out the rest of the React app by injecting new components into the MainRouter component.
*/
export default hot(module)(App)