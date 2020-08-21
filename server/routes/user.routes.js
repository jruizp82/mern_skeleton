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

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read) // Fetching a user with GET. Para leer solo necesita autenticación
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update) // Updating a user with PUT. Necesita autenticación y autorización
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove) // Deleting a user with DELETE. Necesita autenticación y autorización

// configure the Express router so that it handles the userId parameter in a requested route by executing the userByID controller function
/* Whenever the Express app receives a request to a route that matches a path containing the :userId parameter in it, the app will execute the userByID controller function
*/
router.param('userId', userCtrl.userByID) 

export default router