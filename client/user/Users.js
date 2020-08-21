/* Shows the names of all the users that have been fetched from the database and links each name to the user profile. 
The following component can be viewed by any visitor to the application and will render at the '/users' route.
*/

import React, {useState, useEffect} from 'react'
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
import ArrowForward from '@material-ui/icons/ArrowForward'
import Person from '@material-ui/icons/Person'
import {Link} from 'react-router-dom'
import {list} from './api-user.js'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: theme.spacing(5)
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

/* We start by initializing the state with an empty array of users. We are using the built-in React hook, useState, to add state to this function component. 
By calling this hook, we are essentially declaring a state variable named users, which can be updated by invoking setUsers, and also set the initial value of users to [].
Using the built-in useState hook allows us to add state behavior to a function component in React. Calling it will declare a state variable, similar to using this.state 
in class component definitions. The argument that's passed to useState is the initial value of this variable – in other words, the initial state. 
Invoking useState returns the current state and a function that updates the state value, which is similar to this.setState in a class definition. 
const [users, setUsers] = useState([])

With the users state initialized, next, we will use another built-in React hook named useEffect to fetch a list of users from the backend and update the users value in the state. 

The Effect Hook, useEffect, serves the purpose of the componentDidMount, componentDidUpdate, and componentWillUnmount React life cycle methods that we would otherwise use 
in React classes. Using this hook in a function component allows us to perform side effects such as fetching data from a backend. By default, React runs the effects defined with
useEffect after every render, including the first render. But we can also instruct the effect to only rerun if something changes in state. Optionally, we can also define 
how to clean up after an effect, for example, to perform an action such as aborting a fetch signal when the component unmounts to avoid memory leaks.

In our Users component, we use useEffect to call the list method from the api-user.js helper methods. This will fetch the user list from the backend and load the user
data into the component by updating the state. In this effect, we also add a cleanup function to abort the fetch call when the component unmounts. 
To associate a signal with the fetch call, we use the AbortController web API, which allows us to abort DOM requests as needed.

In the second argument of this useEffect hook, we pass an empty array so that this effect cleanup runs only once upon mounting and unmounting, and not after every render.

*/
export default function Users() {
    const classes = useStyles()
    const [users, setUsers] = useState([])

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUsers(data)
            }
        })

        return function cleanup(){
            abortController.abort()
        }
    }, [])

    /* Finally, in the return of the Users function component, we add the actual view content. The view is composed of Material-UI components such as Paper, List, and ListItem. 
    These elements are styled with the CSS that is defined and made available with the makeStyles hook.
    In this view, to generate each list item, we iterate through the array of users in the state using the map function. A list item is rendered with an individual user's name
    from each item that's accessed per iteration on the users array.
    */
    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                All Users
            </Typography>
            <List dense>
                {users.map((item, i) => {
                    return <Link to={"/user/" + item._id} key={i}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <Person/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={item.name}/>
                            <ListItemSecondaryAction>
                                <IconButton>
                                    <ArrowForward/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Link>
                })
                }
            </List>
        </Paper>
    )
}