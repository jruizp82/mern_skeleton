import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

// to define route paths with the relevant HTTP methods and assign the corresponding controller function that should be called when these requests are received by the server
const router = express.Router() 

// When the server receives requests at each of these defined routes, the corresponding controller functions are invoked.
// For example, When the Express app gets a POST request at '/api/users', it calls the create function we defined in the controller

router.route('/api/users')
    .get(userCtrl.list) // Listing users with GET
    .post(userCtrl.create) // Creating a new user with POST

// We will set up a route to the photo stored in the database for each user, and also add another route that will fetch a default photo if the given user did not upload a profile photo
router.route('/api/users/photo/:userId')
    .get(userCtrl.photo, userCtrl.defaultPhoto)
router.route('/api/users/defaultphoto')
    .get(userCtrl.defaultPhoto)

// When a user follows or unfollows another user from the view, both users' records in the database will be updated in response to the follow or unfollow requests.
router.route('/api/users/follow')
    .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower)
router.route('/api/users/unfollow')
    .put(authCtrl.requireSignin, userCtrl.removeFollowing, userCtrl.removeFollower)

// We will implement a new API on the server to query the database and fetch the list of users the current user is not following.
router.route('/api/users/findpeople/:userId')
    .get(authCtrl.requireSignin, userCtrl.findPeople)

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read) // Fetching a user with GET. Para leer solo necesita autenticación
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update) // Updating a user with PUT. Necesita autenticación y autorización
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove) // Deleting a user with DELETE. Necesita autenticación y autorización

/* configure the Express router so that it handles the userId parameter in a requested route by executing the userByID controller function
Whenever the Express app receives a request to a route that matches a path containing the :userId parameter in it, the app will execute the userByID controller function
*/
router.param('userId', userCtrl.userByID)

export default router