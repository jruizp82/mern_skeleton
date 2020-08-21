import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/auth/signin') // POST request to authenticate the user with their email and password
  .post(authCtrl.signin)
router.route('/auth/signout') // GET request to clear the cookie containing a JWT that was set on the response object after sign-in
  .get(authCtrl.signout)

  export default router