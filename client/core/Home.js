/* For each React component implementation, we need to import the libraries, modules, and files being used in the implementation code. 
The component file will start with imports from React, Material-UI, React Router modules, images, CSS, API fetch, and the auth helpers from our code, 
as required by the specific component.
*/

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import unicornbikeImg from './../assets/images/unicornbike.jpg' // The image file is kept in the client/assets/images/ folder and is imported so that
                                                                // it can be added to the Home component

/* After the imports, we will define the CSS styles that are required to style the elements in the component by utilizing the Material-UI theme variables
and makeStyles, which is a custom React hook API provided by Material-UI.

Hooks are new to React. Hooks are functions that make it possible to use React state and life cycle features in function components, without having to write 
a class to define the component. React provides some built-in hooks, but we can also build custom hooks as needed to reuse stateful behavior across different components. 
To learn more about React Hooks, visit reactjs.org/docs/hooks-intro.html.

The JSS style objects defined here will be injected into the component using the hook returned by makeStyles. The makeStyles hook API takes a function as an
argument and gives access to our custom theme variables, which we can use when defining the styles.

Material-UI uses JSS, which is a CSS-in-JS styling solution for adding styles to components. JSS uses JavaScript as a language to describe styles.
To learn more about JSS, visit http:/​/cssinjs.org/?v=v9.8.1. For examples of how to customize the Material-UI component styles, 
check out the Material-UI documentation at https://material-ui.com/​.
*/

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5)
    },
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    },
    credit: {
        padding: 10,
        textAlign: 'right',
        backgroundColor: '#ededed',
        borderBottom: '1px solid #d0d0d0',
        '& a':{
            color: '#3f4771'
        } 
    }
}))

/* While writing the function to define the component, we will compose the content and behavior of the component. The Home component will contain a Material-UI Card
with a headline, an image, and a caption, all styled with the styles we defined previously and returned by calling the useStyles() hook.
We defined and exported a function component named Home. The exported component can now be used for composition within other components. 
We already imported this Home component in a route in the MainRouter component.

We will define all our React components as functional components. We will utilize React Hooks, which is a new addition to React, to add state and life cycle features, 
instead of using class definitions to achieve the same.
*/
export default function Home(){
    const classes = useStyles()
    return (
        <Card className={classes.card}>
            <Typography variant="h6" className={classes.title}>
                Home Page
            </Typography>
        <CardMedia className={classes.media}
                    image={unicornbikeImg} 
                    title="Unicorn Bicycle"/>
        <Typography variant="body2" component="p" className={classes.credit} color="textSecondary">
            Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash
        </Typography>
        <CardContent>
            <Typography variant="body1" component="p">
                Welcome to the MERN Skeleton home page.
            </Typography>
        </CardContent>
        </Card>        
    )    
}