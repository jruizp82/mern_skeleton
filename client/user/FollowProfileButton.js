/* We will create a separate component for the follow button called FollowProfileButton, which will be added to the Profile component. This component will show 
the Follow or Unfollow button, depending on whether the current user is already a follower of the user in the profile.
We add this button in a separate React component, integrate it with the existing user profile view, and connect it to the follow and unfollow fetch methods.

When FollowProfileButton is added to the profile, the following value will be determined and sent from the Profile component as a prop to FollowProfileButton, 
along with the click handler that takes the specific follow or unfollow fetch API to be called as a parameter.
*/

import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import {unfollow, follow} from './api-user.js'

export default function FollowProfileButton (props) {
    const followClick = () => {
        props.onButtonClick(follow)
    }
    const unfollowClick = () => {
        props.onButtonClick(unfollow)
    }

    return (<div>
        { props.following
            ? (<Button variant="contained" color="secondary" onClick={unfollowClick}>Unfollow</Button>)
            : (<Button variant="contained" color="primary" onClick={followClick}>Follow</Button>)
        }
    </div>)
}

FollowProfileButton.propTypes = {
    following: PropTypes.bool.isRequired,
    onButtonClick: PropTypes.func.isRequired
}