// Creamos un archivo plantilla en la raíz del proyecto que renderizará el HTML con React componentes

/* To add the bundled frontend code in the HTML to render our React frontend, we will update the template.js file so that it adds the script file from the dist folder 
to the end of the <body> tag. This script tag <script type="text/javascript" src="/dist/bundle.js"></script> will load our React frontend code in the browser 
when we visit the root URL '/' with the server running.
*/

/* The markup and CSS that we generated on the server must be added to the template.js HTML code for it to be loaded when the server renders the template.
This will load the server-generated code in the browser before the frontend script is ready to take over.
*/
export default ({markup, css}) => {
    return `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          >
          <title>MERN Skeleton</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
          <style>
              a{
                text-decoration: none                
              }
          </style>
        </head>
        <body style="margin:0">
          <div id="root">${markup}</div>
          <style id="jss-server-side">${css}</style>
          <script type="text/javascript" src="/dist/bundle.js"></script>         
        </body>
      </html>`
}