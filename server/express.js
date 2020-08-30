/*yarn development: This command will get Nodemon, Webpack, and the server started for development.
yarn build: This will generate the client and server code bundles for production mode (before running this script, make sure to remove the devBundle.compile code from server.js).
yarn start: This command will run the bundled code in production.*/

/* Para instalar Express: yarn add express
Este es el archivo de configuración de express.
*/

import express from 'express'
import path from 'path'
import bodyParser from 'body-parser' // Request body-parsing middleware to handle the complexities of parsing streamable request objects so that we can simplify browser-server communication by exchanging JSON in the request body.
                                     // To install the module, run yarn add body-parser
import cookieParser from 'cookie-parser' // Cookie parsing middleware to parse and set cookies in request objects. To install the cookie-parser module, run yarn add cookie-parser
import compress from 'compression' // Compression middleware that will attempt to compress response bodies for all requests that traverse through the middleware. To install the compression module, run yarn add compression
import cors from 'cors' // Middleware to enable cross-origin resource sharing (CORS). To install the cors module, run yarn add cors
import helmet from 'helmet' // Collection of middleware functions to help secure Express apps by setting various HTTP headers. To install the helmet module, run yarn add helmet
import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import postRoutes from './routes/post.routes'

// modules for server side rendering. The following modules are required to render the Reactcomponents and use renderToString
import React from 'react'
import ReactDOMServer from 'react-dom/server'
// The MainRouter is the root component in our frontend.
import MainRouter from './../client/MainRouter'
// StaticRouter is a stateless router that takes the requested URL to match with the frontend route which was declared in the MainRouter component.
import { StaticRouter } from 'react-router-dom'

// The following modules will help generate the CSS styles for the frontend components based on the stylings and Material-UI theme that are used on the frontend
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'

//comment out before building for production
import devBundle from './devBundle' // only development

const CURRENT_WORKING_DIR = process.cwd()
const app = express() 

//comment out before building for production
devBundle.compile(app) // only development

/*... configure express ... */
// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

/* To ensure that the Express server properly handles the requests to static files such as CSS files, images, or the bundled client-side JS, we will configure it so that it serves
static files from the dist folder by adding the following configuration in express.js.
With this configuration in place, when the Express app receives a request at a route starting with /dist, it will know to look for the requested static resource in the dist folder 
before returning the resource in the response. Now, we can load the bundled files from the dist folder in the frontend
*/
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)

/* Update the express.js file to import this template and send it in the response to a GET request for the '/' route.

app.get('/', (req, res) => {
 res.status(200).send(Template())
})
*/

/* Currently, when the React Router routes or pathnames are directly entered in the browser address bar or when a view that is not at the root path is refreshed, the URL does not work. 
This happens because the server does not recognize the React Router routes we defined in the frontend. We have to implement basic server-side rendering on the backend 
so that the server is able to respond when it receives a request to a frontend route.

The basic idea behind server-side rendering React apps is to use the renderToString method from react-dom to convert the root React component into a markup string. 
Then, we can attach it to the template that the server renders when it receives a request.

In express.js, we will replace the code that returns template.js in response to the GET request for '/' with code that, upon receiving any incoming GET request, 
generates some server-side rendered markup and the CSS of the relevant React component tree, before adding this markup and CSS to the template.
*/

/* To generate the CSS and markup representing the React frontend views on the serverside, we will use Material-UI's ServerStyleSheets and React's renderToString.
On every request received by the Express app, we will create a new ServerStyleSheets instance. Then, we will render the relevant React tree with the server-side collector 
in a call to renderToString, which ultimately returns the associated markup or HTML string version of the React view that is to be shown to the user in response to the requested URL.
*/
app.get('*', (req, res) => {
    const sheets = new ServerStyleSheets() // Generate CSS styles using Material-UI's ServerStyleSheets
    const context = {}
    // Use renderToString to generate markup which renders components specific to the route requested
    /* While rendering the React tree, the client app's root component, MainRouter, is wrapped with the Material-UI ThemeProvider to provide the styling props that are
    needed by the MainRouter child components. The stateless StaticRouter is used here instead of the BrowserRouter that's used on the client-side in order to wrap
    MainRouter and provide the routing props that are used for implementing the clientside components.

    Based on these values, such as the requested location route and theme that are passed in as props to the wrapping components, renderToString will return the
    markup containing the relevant view.
    */
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    )
    
    /* Once the markup has been generated, we need to check if there was a redirect rendered in the component to be sent in the markup. If there was no redirect, then we
    get the CSS string from sheets using sheets.toString, and, in the response, we send the Template back with the markup and CSS injected.

    An example of a case where redirect is rendered in the component is when we're trying to access a PrivateRoute via a server-side render. As the server-side cannot 
    access the auth token from the browser's sessionStorage, the redirect in PrivateRoute will render. The context.url value , in this case, will have the '/signin' route, 
    and hence, instead of trying to render the PrivateRoute component, it will redirect to the '/signin' route.
    */
    if (context.url) {
        return res.redirect(303, context.url)
    }
    const css = sheets.toString()
    
    // Return template with markup and CSS styles in the response
    res.status(200).send(Template({
        markup: markup,
        css: css
    }))
})  

// Catch unauthorised errors
/* To handle auth-related errors thrown by express-jwt when it tries to validate JWT tokens in incoming requests, we need to add the following error-catching code to the
Express app configuration. Express-jwt throws an error named UnauthorizedError when a token cannot be validated for some reason. We catch this error here to return a 401 status 
back to the requesting client. We also add a response to be sent if other server-side errors are generated and caught here.

*/

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message})
    } else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
})

export default app