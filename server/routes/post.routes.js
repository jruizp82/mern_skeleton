import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

/* To implement the Newsfeed-specific API, we need to add the route endpoint that will receive the request for Newsfeed posts and respond accordingly to the requesting client-side.
On the backend, we need to define the route path that will receive the request for retrieving Newsfeed posts for a specific user.
*/
router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed)

/* To retrieve posts that have been shared by a specific user, we need to add a route endpoint that will receive the request for these posts and respond accordingly to the
requesting client-side. On the backend, we will define another post-related route that will receive a query to return posts by a specific user.
*/
router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignin, postCtrl.listByUser)

// On the server, we will define an API to create the post in the database, starting by declaring a route to accept a POST request
router.route('/api/posts/new/:userId')
    .post(authCtrl.requireSignin, postCtrl.create)

/* To retrieve the uploaded photo, we will also set up a photo route endpoint that, on request, will return the photo associated with a specific post. 
The photo URL route will be defined with the other post-related routes 
*/
router.route('/api/posts/photo/:postId')
    .get(postCtrl.photo)

/* The delete button is only visible if the signed-in user and postedBy user are the same for the specific post being rendered. For the post to be deleted from the
database, we will have to set up a delete post API in the backend which will also have a fetch method in the frontend that will be applied when delete is clicked. 
This is the route for the delete post API endpoint.

The delete route will check for authorization before calling remove on the post by ensuring the authenticated user and postedBy user are the same users. (isPoster method)
*/
router.route('/api/posts/:postId')
    .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove)

/* The like API will be a PUT request that will update the likes array in the Post document. The request will be received at the api/posts/like route.
The unlike API will be implemented similar to the like API, with its own route.
*/
router.route('/api/posts/like')
    .put(authCtrl.requireSignin, postCtrl.like)
router.route('/api/posts/unlike')
    .put(authCtrl.requireSignin, postCtrl.unlike)

/* To implement the add comment API, we will set up a PUT route as follows to update the post.
We will implement an uncomment API at the following PUT route.
*/
router.route('/api/posts/comment')
    .put(authCtrl.requireSignin, postCtrl.comment)
router.route('/api/posts/uncomment')
    .put(authCtrl.requireSignin, postCtrl.uncomment)

// We are using the :userID parameter in this route to specify the currently signed-in user.
router.param('userId', userCtrl.userByID)
// Since the photo route uses the :postID parameter, we will set up a postByID controller method to fetch a specific post by its ID before returning it to the photo request.
router.param('postId', postCtrl.postByID)

export default router