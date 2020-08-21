/* This file will be the entry point to render the complete React app, as already indicated in the client-side Webpack configuration object.
We import the root or top-level React component that will contain the whole frontend and render it to the div element with the 'root' ID specified in the HTML document in template.js
Here, the top-level root React component is the App component and it is being rendered in the HTML.
*/ 

/* Now that the React components will be rendered on the server-side, we can update the main.js code so that it uses ReactDOM.hydrate() instead of ReactDOM.render()
The hydrate function hydrates a container that already has HTML content rendered by ReactDOMServer. This means the server-rendered markup is preserved and only 
event handlers are attached when React takes over in the browser, allowing the initial load performance to be better.
*/
import React from 'react'
import { hydrate } from 'react-dom'
import App from './App'

hydrate(<App/>, document.getElementById('root'))