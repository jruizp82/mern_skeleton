/* The Signin component is also a form with only email and password fields for signing in. This component is quite similar to the Signup component 
and will render at the '/signin' path. The key difference is in the implementation of redirection after a successful sign-in and storing the received JWT credentials.
*/

import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import { Redirect } from 'react-router-dom'
import { signin } from './api-auth.js'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2)
    },
    error: {
        verticalAlign: 'middle'
    },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    }
}))

// For redirection, we will use the Redirect component from React Router. First, initialize a redirectToReferrer value to false in the state with the other fields
export default function Signin(props) {
    const classes = useStyles()
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToReferrer: false
    })

    /* The Signin function will take props in the argument that contain React Router variables. We will use these for the redirect. redirectToReferrer should be set
    to true when the user successfully signs in after submitting the form and the received JWT is stored in sessionStorage. To store the JWT and redirect afterward,
    we will call the authenticate() method defined in auth-helper.js. This implementation will go in the clickSubmit() function so that it can be called on form submit.
    */
    const clickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined
        }

        signin(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error})
            } else {
                auth.authenticate(data, () => {
                setValues({ ...values, error: '',redirectToReferrer: true})
                })
            }
        })
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    //The Redirect component, if rendered, will take the app to the last location that was received in the props or to the Home component at the root.
    const {from} = props.location.state || {
        from: {
            pathname: '/'
        }
    }

    /* The redirection will happen conditionally based on the redirectToReferrer value using the Redirect component from React Router. 
    We add the redirect code inside the function before the return block, as follows.    
    */
    const {redirectToReferrer} = values
    if (redirectToReferrer) {
        return (<Redirect to={from}/>)
    }

    // The return code it will contain the same form elements with just email and password fields, a conditional error message, and the submit button.
    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.title}>
                    Sign In
                </Typography>
                <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
                <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
                <br/> {
                    values.error && (
                    <Typography component="p" color="error">
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