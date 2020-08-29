// We will create a generic PostList component that will render any list of posts provided to it, which we can use in both the Newsfeed and the Profile components.

import React from 'react'
import PropTypes from 'prop-types'
import Post from './Post'

/* The PostList component will iterate through the list of posts passed to it as props from the Newsfeed or the Profile, and pass the data of each post to a Post
component that will render details of the post. PostList will also pass the removeUpdate function that was sent as a prop from the parent component to the Post component 
so that the state can be updated when a single post is deleted. 
*/
export default function PostList (props) {
    return (
        <div style={{marginTop: '24px'}}>
            {props.posts.map((item, i) => {
                return <Post post={item} key={i}
                    onRemove={props.removeUpdate}/>
            })
            }
        </div>    
    )
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
}