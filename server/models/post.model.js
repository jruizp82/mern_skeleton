// The Post schema will store a post's text content, a photo, a reference to the user who posted, time of creation, likes on the post from users, and comments on the post by users.

import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    // text will be a required field that needs to be provided by the user on new post creation from the view
    text: {
        type: String,
        required: 'Text is required'
    },
    /* photo will be uploaded from the user's local files during post creation and stored in MongoDB, similar to the user profile photo upload feature. 
    The photo will be optional for each post.
    */
    photo: {
        data: Buffer,
        contentType: String
    },
    // References to the users who liked a specific post will be stored in a likes array
    likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    // Each comment on a post will contain text content, the time of creation, and a reference to the user who posted the comment. Each post will have an array of comments    
    comments: [{
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: { type: mongoose.Schema.ObjectId, ref: 'User'}
    }],
    // Creating a post will require a user to be signed-in first so that we can store a reference to the user who is posting in the postedBy field
    postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
    // The created time will be generated automatically at the time of post creation in the database
    created: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Post', PostSchema)