/* The EditProfile component allows the authorized user to edit their own profile information in a form similar to the signup form.
Upon loading at '/user/edit/:userId', the component will fetch the user's information with their ID after verifying JWT for auth, and then load the form with
the received user information. The form will allow the user to edit and submit only the changed information to the update fetch call, and, on successful update, 
redirect the user to the Profile view with updated information.
*/

import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2)
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectedTitle
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    input: {
        display: 'none'
    },
    filename:{
        marginLeft:'10px'
    }
}))

/* EditProfile will load the user information the same way as in the Profile component, that is, by fetching with read in useEffect using the userId parameter
from match.params. It will gather credentials from auth.isAuthenticated. The form view will contain the same elements as the Signup component, with the input
values being updated in the state when they change.

On form submit, the component will call the update fetch method with the userId, JWT and updated user data.

*/
export default function EditProfile({ match }) {
    const classes = useStyles()
    const [values, setValues] = useState({
        name: '',
        about: '',
        photo: '',
        email: '',
        password: '',        
        redirectToProfile: false,
        error: '',
        id: ''
    })
    const jwt = auth.isAuthenticated()
    
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
        if (data && data.error) {
            setValues({...values, error: data.error})
        } else {
            setValues({...values, id: data._id, name: data.name, email: data.email, about: data.about})
        }
        })
        return function cleanup(){
            abortController.abort()
        }

    }, [match.params.userId])

    /* Uploading files to the server with a form requires a multipart form submission. We will modify the EditProfile component so that it uses the FormData API to
    store the form data in the format needed for encoding in the multipart/formdata type. We need to initialize FormData and append the values from the fields that were updated.
    */
    const clickSubmit = () => {
        let userData = new FormData()
        values.name && userData.append('name', values.name)
        values.email && userData.append('email', values.email)
        values.password && userData.append('password', values.password)
        values.about && userData.append('about', values.about)
        values.photo && userData.append('photo', values.photo)  
        
        // After appending all the fields and values to it, userData is sent with the fetch API call to update the user
        update({
            userId: match.params.userId
        }, {
            t: jwt.token
        }, userData).then((data) => {
            if (data && data.error) {
                setValues({...values, error: data.error})
            } else {
                //setValues({...values, userId: data._id, redirectToProfile: true})
                setValues({...values, 'redirectToProfile': true})
            }
        })
    }

    // We will update the input handleChange function so that we can store input values for both the text fields and the file input
    const handleChange = name => event => {
        const value = name === 'photo'
            ? event.target.files[0]
            : event.target.value
        setValues({...values, [name]: value})
    }

    const photoUrl = values.id
                 ? `/api/users/photo/${values.id}?${new Date().getTime()}`
                 : '/api/users/defaultphoto'

    // Depending on the response from the server, the user will either see an error message or be redirected to the updated Profile page using the Redirect component, as follows.    
    if (values.redirectToProfile) {
      return (<Redirect to={'/user/' + values.userId}/>)
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.title}>
                    Edit Profile
                </Typography>
                <Avatar src={photoUrl} className={classes.bigAvatar}/><br/>                
                <input accept="image/*" id="icon-button-file" className={classes.input} onChange={handleChange('photo')} type="file" />
                <label htmlFor="icon-button-file">
                    <Button variant="contained" color="default" component="span">
                        Upload 
                        <FileUpload/>
                    </Button>        
                </label>
                <span className={classes.filename}>
                    {values.photo ? values.photo.name : ''}
                </span><br/>
                <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>`
                <TextField id="multiline-flexible" label="About" multiline rows="2" value={values.about} onChange={handleChange('about')} className={classes.textField} margin="normal"/><br/>
                <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
                <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
                <br/> {
                    values.error && (<Typography component="p" color="error">
                <Icon color="error" className={classes.error}>error</Icon>
                    {values.error}
                </Typography>)
                }
            </CardContent>
            <CardActions>
                <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
            </CardActions>
        </Card>
    )
}