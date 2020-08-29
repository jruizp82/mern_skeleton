import mongoose from 'mongoose'
import crypto from 'crypto' // The crypto module provides a range of cryptographic functionality, including some standard cryptographic hashing algorithms

// The mongoose.Schema() function takes a schema definition object as a parameter to generate a new Mongoose schema object 
// that will specify the properties or structure of each document in a collection
const UserSchema = new mongoose.Schema({ 
    name: {
        type: String,
        trim: true, // se guardara sin espacios en blanco
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists', // debe ser único, si ya existe un email muestra el mensaje
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], // escribir una dirección válida de email
        required: 'Email is required'
    },
    // The hashed_password and salt fields represent the encrypted user password that we will use for authentication    
    hashed_password: {
        type: String,
        required: "Password is required"
    },      
    salt: String,  // The actual password string is not stored directly in the database for security purposes and is handled separately
    // These Date values will be programmatically generated to record timestamps that indicate when a user is created and user data is updated
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    // To store the short description we need to add an about field to the user model
    about: {
        type: String,
        trim: true
    },
    // To store the uploaded profile photo directly in the database, we will update the user model to add a photo field that stores the file as data of the Buffer type,
    // along with the file's contentType. 
    // An image file that's uploaded by the user from the client- side will be converted into binary data and stored in this photo field for documents in the Users collection in MongoDB.
    photo: {
        data: Buffer,
        contentType: String
    },
    /* To store the list of following and followers in the database, we will need to update the user model with two arrays of user references.
    These references will point to the users in the collection being followed by or following the given user.
    */
    following: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}]    
})

/* The password string that's provided by the user is not stored directly in the user document. Instead, it is handled as a virtual field
When the password value is received on user creation or update, it is encrypted into a new hashed value and set to the hashed_password field, 
along with the unique salt value in the salt field
*/
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })

/* Ensure that a password value is provided and it has a length of at least six characters when a new user is created or an existing password is updated
We achieve this by adding custom validation to check the password value before Mongoose attempts to store the hashed_password value. 
If validation fails, the logic will return the relevant error message
*/
UserSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

/* The encryption logic and salt generation logic, which are used to generate thehashed_password and salt values representing the password value, 
are defined as UserSchema methods.

authenticate: This method is called to verify sign-in attempts by matching the user-provided password text with the hashed_password
stored in the database for a specific user

encryptPassword: This method is used to generate an encrypted hash from the plain-text password and a unique salt value using the crypto module from Node

makeSalt: This method generates a unique and random salt value using the current timestamp at execution and Math.random()

Hashing algorithms generate the same hash for the same input value. But to ensure two users don't end up with the same hashed password if they happen to use 
the same password text, we pair each password with a unique salt value before generating the hashed password for each user. 
This will also make it difficult to guess the hashing algorithm being used because the same user input is seemingly generating different hashes.

These UserSchema methods are used to encrypt the user-provided password string into a hashed_password with a randomly generated salt value. 
The hashed_password and the salt are stored in the user document when the user details are saved to the database on a create or update. 
Both the hashed_password and salt values are required in order to match and authenticate a password string provided during user sign-in using the authenticate method. 
We should also ensure the user selects a strong password string to begin with, which can done by adding custom validation to the passport field. 
*/

UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt) // use the SHA1 hashing algorithm and createHmac from crypto to generate the cryptographic HMAC hash from the password text and salt pair
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

export default mongoose.model('User', UserSchema)