/* Post details in each post will be rendered in the Post component, which will receive the post data as props from the PostList component, as well as the onRemove prop,
which needs to be applied if a post is deleted.

The Post component layout will have a header showing details of the poster, the content of the post, an actions bar with a count of likes and comments, and a comments section.
*/

import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import {remove, like, unlike} from './api-post.js'
import Comments from './Comments'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth:600,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
        backgroundColor: 'white',
        padding: `${theme.spacing(2)}px 0px`
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    text: {
        margin: theme.spacing(2)
    },
    photo: {
        textAlign: 'center',
        backgroundColor: '#f2f5f4',
        padding:theme.spacing(1)
    },
    media: {
        height: 200
    },
    button: {
        margin: theme.spacing(1),
    }
}))

export default function Post (props){
    const classes = useStyles()
    const jwt = auth.isAuthenticated()
    /* When the Post component is rendered, we need to check if the currently signed-in user has liked the post or not so that the appropriate like option can be shown. 
    The following checkLike method checks whether the currently signed-in user is referenced in the post's likes array or not.
    This checkLike function can be called while setting the initial value of the like state variable, which keeps track of whether the current user liked the given post or not.
    */
    const checkLike = (likes) => {
        let match = likes.indexOf(jwt.user._id) !== -1
        return match
    }
    /* The like value that's set in the state using the checkLike method can be used to render a heart outline button or a full heart button. A heart outline button will render
    if the user has not liked the post; clicking it will make a call to the like API, show the full heart button, and increment the likes count. The full heart button will indicate
    the current user has already liked this post; clicking this will call the unlike API, render the heart outline button, and decrement the likes count.
    The likes count is also set initially when the Post component mounts and props are received by setting the likes value to the state with props.post.likes.length
    The likes-related values are updated again when a "like" or "unlike" action takes place, and the updated post data is returned from the API call.
    */
    const [values, setValues] = useState({
        like: checkLike(props.post.likes),
        likes: props.post.likes.length,
        comments: props.post.comments
    })   
    
    // useEffect(() => {
    //   setValues({...values, like:checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments})
    // }, [])
    
    /* To handle clicks on the like and unlike buttons, we will set up a clickLike method that will call the appropriate fetch method based on whether it is a "like" or 
    "unlike" action, and then update the state of the like and likes count for the post.
    Which of the like or unlike API endpoints will be called on a click depends on the value of the like variable in the state. Once the chosen API endpoint is called
    successfully, the values are updated in the state so that they can be reflected in the view.
    */
    const clickLike = () => {
        let callApi = values.like ? unlike : like        
        callApi({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, props.post._id).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setValues({...values, like: !values.like,
                    likes: data.likes.length})
            }
        })
    }

    /* The rest of the implementation for the delete API with a remove controller method and fetch method for the frontend are the same as for the other API implementations.
    The important difference here, in the delete post feature, is the call to the onRemove update method in the Post component when delete succeeds. The onRemove method 
    is sent as a prop from either Newsfeed or Profile to update the list of posts in the state when the delete is successful. 
    The following deletePost method is called when the delete button is clicked on a post. This method makes a fetch call to the delete post API and on success, 
    updates the list of posts in the state by executing the onRemove method, which is received as a prop from the parent component.
    */
    const deletePost = () => {   
        remove({
            postId: props.post._id
        }, {
            t: jwt.token
        }).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                props.onRemove(props.post)
            }
        })
    }

    /* The updateComments method, which will allow the comments and comment count to be updated when a comment is added or deleted, is defined in the Post component 
    and passed as a prop to the Comments component.
    This method takes the updated list of comments as a parameter and updates the state that holds the list of comments rendered in the view.
    The initial state of comments in the Post component is set when the Post component mounts and receives the post data as props. 
    The comments that are set here are sent as props to the Comments component and used to render the comment count next to the likes action in the action bar of the Post layout.

    This relationship between the comment count in the Post component and the comments that are rendered and updated in the Comments component gives a simple demonstration 
    of how changing data is shared among nested components in React to create dynamic and interactive user interfaces.
    */
    const updateComments = (comments) => {
        setValues({...values, comments: comments})
    }

    return (
        <Card className={classes.card}>
            {/* The header will contain information such as the name, avatar, and link to the profile of the user who posted, as well as the date the post was created.*/}
            <CardHeader
                avatar={
                    <Avatar src={'/api/users/photo/'+props.post.postedBy._id}/>
                }
                /* The header will also conditionally show a delete button if the signed-in user is viewing their own post. */
                action={ props.post.postedBy._id === auth.isAuthenticated().user._id &&
                    <IconButton onClick={deletePost}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={<Link to={"/user/" +
                    props.post.postedBy._id}>{props.post.postedBy.name}</Link>}
                    subheader={(new Date(props.post.created)).toDateString()}
                    className={classes.cardHeader}
            />
            {/* The content section will show the text of the post and the image if the post contains a photo.
            The image is loaded by adding the photo API to the src attribute in the img tag if the given post contains a photo. */}
            <CardContent className={classes.cardContent}>
                <Typography component="p" className={classes.text}>
                    {props.post.text}
                </Typography>
                {props.post.photo &&
                    (<div className={classes.photo}>
                        <img className={classes.media}
                            src={'/api/posts/photo/'+ props.post._id}/>
                    </div>)
                }
            </CardContent>
            {/* The actions section will contain an interactive "like" option with a display of the total number of likes on the post and a comment icon 
            with the total number of comments on the post. The details of the likes for each post are retrieved within the post object that's received in the props. */}
            <CardActions>
                { values.like
                    ? <IconButton onClick={clickLike} className={classes.button}
                        aria-label="Like" color="secondary">
                        <FavoriteIcon />
                    </IconButton>
                    : <IconButton onClick={clickLike} className={classes.button}
                        aria-label="Unlike" color="secondary">
                        <FavoriteBorderIcon />
                    </IconButton> } <span>{values.likes}</span>
                    <IconButton className={classes.button}
                        aria-label="Comment" color="secondary">
                        <CommentIcon/>
                    </IconButton> <span>{values.comments.length}</span>
            </CardActions>
            <Divider/>
            {/* The comments section will contain all the comment-related elements in the Comments component and will get props such as the postId and the comments data, 
            along with a state updating method that can be called when a comment is added or deleted in the Comments component. */}
            <Comments postId={props.post._id} comments={values.comments} updateComments={updateComments}/>
        </Card>
    )
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}