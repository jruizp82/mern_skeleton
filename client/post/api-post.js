// We will use the Newsfeed API in the frontend to fetch the related posts and display these posts in the Newsfeed view.

/* We will add a fetch method to make a request to the API.
This is the fetch method that will load the posts that are rendered in PostList, which is added as a child component to the Newsfeed component. 
So, this fetch needs to be called in the useEffect hook in the Newsfeed component
*/
const listNewsFeed = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/posts/feed/'+ params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/* We will use the list-posts-by-user API in the frontend to fetch the related posts and display these posts in the profile view. 
To use this API, we will add a fetch method to the frontend. This fetch method will load the required posts for PostList, which is added to the Profile view.
*/
const listByUser = async (params, credentials) => {
    try {
        let response = await fetch('/api/posts/by/'+ params.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/* We will update api-post.js by adding a create method to make a fetch call to the create API.
This method, like the user edit fetch method, will send a multipart form submission using a FormData object that will contain the text field and the image file.
*/
const create = async (params, credentials, post) => {
    try {
        let response = await fetch('/api/posts/new/'+ params.userId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: post
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

// This method makes a fetch call to the delete post API
const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/posts/' + params.postId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

//To use this API, a fetch method called like will be added, which will be used when the user clicks the like button.
const like = async (params, credentials, postId) => {
    try {
        let response = await fetch('/api/posts/like/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({userId:params.userId, postId: postId})
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

// The unlike API will also have a corresponding fetch method, similar to the like method
const unlike = async (params, credentials, postId) => {
    try {
        let response = await fetch('/api/posts/unlike/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({userId:params.userId, postId: postId})
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/* To use this API in the view, we will set up a fetch method, which takes the current user's ID, the post ID, and the comment object from the view, and sends it 
with the add comment request. This is the comment fetch method
*/
const comment = async (params, credentials, postId, comment) => {
    try {
        let response = await fetch('/api/posts/comment/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId,
                              comment: comment})
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/* To use this API in the view, we will also set up a fetch method similar to the addComment fetch method, that takes the current user's ID, the post ID,
and the deleted comment object to send with the uncomment request.
*/
const uncomment = async (params, credentials, postId, comment) => {
    try {
        let response = await fetch('/api/posts/uncomment/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
        body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

export { listNewsFeed, listByUser, create, remove, like, unlike, comment, uncomment }