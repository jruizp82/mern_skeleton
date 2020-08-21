/* The DeleteUser component is basically a button that we will add to the Profile view that, when clicked, opens a Dialog component asking the user to confirm the delete action.
*/

import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from './../auth/auth-helper'
import {remove} from './api-user.js'
import {Redirect} from 'react-router-dom'

// The DeleteUser component will also receive props from the parent component. In this case, the props will contain the userId that was sent from the Profile component.
export default function DeleteUser(props) {
    // This component initializes the state with open set to false for the Dialog component, as well as redirect set to false so that it isn't rendered first.
    const [open, setOpen] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const jwt = auth.isAuthenticated()
    const clickButton = () => {
        //The dialog is opened when the user clicks the delete button.
        setOpen(true)
    }
    /* The component will have access to the userId that's passed in as a prop from the Profile component, which is needed to call the remove fetch method, along with
    the JWT credentials, after the user confirms the delete action in the dialog.
    On confirmation, the deleteAccount function calls the remove fetch method with the userId from props and JWT from isAuthenticated. On successful deletion, the
    user will be signed out and redirected to the Home view.
    */
    const deleteAccount = () => { 
        remove({
            userId: props.userId
        }, {t: jwt.token}).then((data) => {
        if (data && data.error) {
            console.log(data.error)
        } else {
            auth.clearJWT(() => console.log('deleted'))
            setRedirect(true)
        }
        })
    }
    // The dialog is closed when the user clicks cancel on the dialog.
    const handleRequestClose = () => {
        setOpen(false)
    }
    // The Redirect component from React Router is used to redirect the current user to the Home view
    if (redirect) {
        return <Redirect to='/'/>
    }
    
    // The component function returns the DeleteUser component elements, including a DeleteIcon button and the confirmation Dialog.
    return (<span>
        <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
            <DeleteIcon/>
        </IconButton>

        <Dialog open={open} onClose={handleRequestClose}>
            <DialogTitle>{"Delete Account"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Confirm to delete your account.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRequestClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
                    Confirm
                </Button>
            </DialogActions>
      </Dialog>
    </span>)
}

/* DeleteUser takes the userId as a prop to be used in the delete fetch call, so we need to add a required prop validation check for this React component.
To validate the required injection of userId as a prop to the component, we'll add the PropTypes requirement validator to the defined component.
*/
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}