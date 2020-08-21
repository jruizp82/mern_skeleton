/* The Profile component shows a single user's information in the view at the '/user/:userId' path, where the userId parameter represents the ID of the specific user. 
The completed Profile will display user details, and also conditionally show edit/delete options. 
*/

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Person from '@material-ui/icons/Person'
import Divider from '@material-ui/core/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(5)
    }),
    title: {
        marginTop: theme.spacing(3),
        color: theme.palette.protectedTitle
    }
}))

/* This profile information can be fetched from the server if the user is signed in. To verify this, the component has to provide the JWT credential to the read fetch call;
otherwise, the user should be redirected to the Sign In view.

In the Profile component definition, we need to initialize the state with an empty user and set redirectToSignin to false.

We also need to get access to the match props passed by the Route component, which will contain a :userId parameter value. This can be accessed as match.params.userId.
*/
export default function Profile({ match }) {
    const classes = useStyles()
    const [user, setUser] = useState({})
    const [redirectToSignin, setRedirectToSignin] = useState(false)
    const jwt = auth.isAuthenticated()
    
    /* The Profile component should fetch user information and render the view with these details. To implement this, we will use the useEffect hook, 
    as we did in the Users component.
    
    This effect uses the match.params.userId value and calls the read user fetch method. Since this method also requires credentials to authorize the signed-in user,
    the JWT is retrieved from sessionStorage using the isAuthenticated method from auth-helper.js, and passed in the call to read.

    Once the server responds, either the state is updated with the user information or the view is redirected to the Sign In view if the current user is not authenticated. 
    We also add a cleanup function in this effect hook to abort the fetch signal when the component unmounts.
    */
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
  
        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true)
            } else {
                setUser(data)
            }
        })
  
        return function cleanup(){
            abortController.abort()
        }
    /* This effect only needs to rerun when the userId parameter changes in the route, for example, when the app goes from one profile view to the other. 
    To ensure this effect reruns when the userId value updates, we will add [match.params.userId] in the second argument to useEffect.
    */
    }, [match.params.userId])
    
    // If the current user is not authenticated, we set up the conditional redirect to the Sign In view.
    if (redirectToSignin) {
        return <Redirect to='/signin'/>
    }
    
    // The function will return the Profile view with the following elements if the user who's currently signed in is viewing another user's profile.    
    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <Person/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email}/> {
                        /* However, if the user that's currently signed in is viewing their own profile, they will be able to see edit and delete options in the Profile component
                        To implement this feature, in the first ListItem component in the Profile, add a ListItemSecondaryAction component containing the Edit button and a
                        DeleteUser component, which will render conditionally based on whether the current user is viewing their own profile.

                        The Edit button will route to the EditProfile component, while the custom DeleteUser component will handle the delete operation with the userId passed to
                        it as a prop.
                        */
                        auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id &&
                            (<ListItemSecondaryAction>                                
                                <Link to={"/user/edit/" + user._id}>                                    
                                    <IconButton aria-label="Edit" color="primary">
                                        <Edit/>
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id}/>
                            </ListItemSecondaryAction>)
                    }
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemText primary={"Joined: " + (
                        new Date(user.created)).toDateString()}/>
                </ListItem>
            </List>
        </Paper>
    )
}
