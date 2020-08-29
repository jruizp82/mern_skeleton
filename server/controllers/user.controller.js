/* This file will contain definitions of the controller methods that were used in the user route declarations as callbacks to be executed 
when a route request is received by the server
*/

import User from '../models/user.model'
import extend from 'lodash/extend' // lodash is a JavaScript library that provides utility functions for common programming tasks, including the manipulation of arraysand objects. 
                                   // To install lodash, run yarn add lodash
import errorHandler from './../helpers/dbErrorHandler' // importa errores cuando un Mongoose error ocurre

/* The formidable will allow the server to read the multipart form data and give us access to the fields and the file, if there are any. 
If there is a file, formidable will store it temporarily in the filesystem. We will read it from the filesystem using the fs module, 
which will retrieve the file type and data, and store it in the photo field in the user model.
*/
import formidable from 'formidable'
import fs from 'fs'

// The default photo is retrieved and sent from the server's file system
import profileImage from './../../client/assets/images/profile-pic.png'

/* This function creates a new user with the user JSON object that's received in the POST request from the frontend within req.body. The call to user.save attempts to save
the new user in the database after Mongoose has performed a validation check on the data. Consequently, an error or success response is returned to the requesting client.

The create function is defined as an asynchronous function with the async keyword, allowing us to use await with user.save(), which returns a Promise. 
Using the await keyword inside an async function causes this function to wait until the returned Promise resolves, before the next lines of code are executed. 
If the Promise rejects, an error is thrown and caught in the catch block.
*/
const create = async (req, res) => { 
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/* The userByID controller function uses the value in the :userId parameter to query the database by _id and load the matching user's details
If a matching user is found in the database, the user object is appended to the request object in the profile key. Then, the next() middleware is used 
to propagate control to the next relevant controller function. For example, if the original request was to read a user profile, 
the next() call in userByID would go to the read controller function.

When a single user is retrieved from the backend, we want the user object to include the names and IDs of the users referenced in the following and followers arrays.
To retrieve these details, we need to update the userByID controller method so that it populates the returned user object. We use the Mongoose populate method to specify 
that the user object that's returned from the query should contain the name and ID of the users referenced in the following and followers lists. This will give us the names 
and IDs of the user references in the followers and following lists when we fetch the user with the read API call.
*/
const userByID = async (req, res, next, id) => { 
    try {
        let user = await User.findById(id)
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec()
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }    
}

/* The read function retrieves the user details from req.profile and removes sensitive information, such as the hashed_password and salt values, before
sending the user object in the response to the requesting client.
*/
const read = (req, res) => { 
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

/* The list controller function finds all the users from the database, populates only the name, email, created, and updated fields in the resulting user list, and then returns
this list of users as JSON objects in an array to the requesting client.
*/
const list = async (req, res) => { 
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }    
}

/* The update function retrieves the user details from req.profile and then uses the lodash module to extend and merge the changes that came in the request body to
update the user data. Before saving this updated user to the database, the updated field is populated with the current date to reflect the last updated timestamp. 
Upon successfully saving this update, the updated user object is cleaned by removing sensitive data, such as hashed_password and salt, before sending the user object in
the response to the requesting client. 
*/
const update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {        
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        let user = req.profile
        user = extend(user, fields)
        user.updated = Date.now()
        
        // This will store the uploaded file as data in the database.
        if(files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }
        
        try {
            await user.save()
            user.hashed_password = undefined
            user.salt = undefined
            res.json(user)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

/* The remove function retrieves the user from req.profile and uses the remove() query to delete the user from the database. 
On successful deletion, the requesting client is returned the deleted user object in the response.
*/
const remove = async (req, res) => { 
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }    
}

/* We will look for the photo in the photo controller method and, if found, send it in the response to the request at the photo route; otherwise, 
we'll call next() to return the default photo.
*/
const photo = (req, res, next) => {
    if(req.profile.photo.data){
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()
}

// We can use the route defined here to display the photo in the views
const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd()+profileImage)
}

/* The addFollowing controller method in the user controller will update the following array for the current user by pushing the followed user's reference into the array.
On successful update of the following array, next() is invoked, and as a result, the addFollower method is executed to add the current user's reference to the 
followed user's followers array.
*/
const addFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId, 
            {$push: {following: req.body.followId}}) 
        next()
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const addFollower = async (req, res) => {
    try{
        let result = await User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    }catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/* For unfollowing, the implementation is similar. The removeFollowing and removeFollower controller methods update the respective 'following' and 'followers' arrays 
by removing the user references with $pull instead of $push.
*/
const removeFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}})
        next()
    }catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const removeFollower = async (req, res) => {
    try{
        let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/* In the findPeople controller method, we will query the User collection in the database to find the users that are not in the current user's following list.
This query will return an array of users that are not followed by the current user and select the name.
$nin selects the documents where:
the field value is not in the specified array or
the field does not exist. 
*/
const findPeople = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    try {
        let users = await User.find({ _id: { $nin : following } }).select('name')
        res.json(users)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default { create, userByID, read, list, remove, update, photo, defaultPhoto, addFollowing, addFollower, removeFollowing, removeFollower, findPeople }