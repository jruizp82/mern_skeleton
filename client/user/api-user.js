/* The Fetch API is a newer standard that makes network requests similar to XMLHttpRequest (XHR) but using promises instead, enabling a simpler and cleaner API. 
To learn more about the Fetch API, visit https:/​/developer.mozilla.org/en-US/docs/Web/​API/Fetch_API.

We will add methods for accessing each of the user CRUD API endpoints, which the React components can use to exchange user data with the server and database as required.
*/

/* The create method will take user data from the view component, which is where we will invoke this method. Then, it will use fetch to make a POST call 
at the create API route, '/api/users', to create a new user in the backend with the provided data.
Finally, in this method, we return the response from the server as a promise. So, the component calling this method can use this promise to handle the response
appropriately, depending on what is returned from the server.
*/

const create = async (user) => {
    try {
        let response = await fetch('/api/users/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/* The list method will use fetch to make a GET call to retrieve all the users in the database, and then return the response from the server as a promise to the component.
The returned promise, if it resolves successfully, will give the component an array containing the user objects that were retrieved from the database.
*/

const list = async (signal) => {
    try {
        let response = await fetch('/api/users/', {
            method: 'GET',
            signal: signal,
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/* The read method will use fetch to make a GET call to retrieve a specific user by ID. Since this is a protected route, besides passing the user ID as a parameter, 
the requesting component must also provide valid credentials, which, in this case, will be a valid JWT received after a successful sign-in.

The JWT is attached to the GET fetch call in the Authorization header using the Bearer scheme, and then the response from the server is returned to the component in a promise. 
This promise, when it resolves, will either give the component the user details for the specific user or notify that access is restricted to authenticated users.
*/

const read = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/users/' + params.userId, {
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

/* The update method will take changed user data from the view component for a specific user, then use fetch to make a PUT call to update the existing user in the backend. 
This is also a protected route that will require a valid JWT as the credential. This method will also return a promise containing the server's response to the user update request.
*/

const update = async (params, credentials, user) => {
    try {
        let response = await fetch('/api/users/' + params.userId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                // Since the content type of the data that's sent to the server is no longer 'application/json', we also need to remove Content-Type from the headers in the fetch call
                //'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + credentials.t
            },
            //body: JSON.stringify(user)
            body: user
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

/* The remove method will allow the view component to delete a specific user from the database and use fetch to make a DELETE call. This is a protected route that
will require a valid JWT as a credential, similar to the read and update methods.
The response from the server to the delete request will be returned to the component as a promise, as in the other methods.
*/

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/users/' + params.userId, {
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

/* To access these API calls in the views, we will update with the follow and unfollow fetch methods. The follow and unfollow methods will be similar, 
making calls to the respective routes with the current user's ID and credentials, and the followed or unfollowed user's ID.
*/
const follow = async (params, credentials, followId) => {
    try {
        let response = await fetch('/api/users/follow/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({userId:params.userId, followId: followId})
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

// The unfollow fetch method is similar; it takes the unfollowed user's ID and calls the unfollow API
const unfollow = async (params, credentials, unfollowId) => {
    try {
        let response = await fetch('/api/users/unfollow/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({userId:params.userId, unfollowId: unfollowId})
        })
        return await response.json()
    } catch(err) {
        console.log(err)
    }
}

// To use the list of users not followed in the frontend, we add a fetch for this API. We can use this findPeople fetch method in the component that will display this list of users. (FindPeople.js)
const findPeople = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/users/findpeople/' + params.userId, {
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

// These user CRUD methods can now be imported and used by the React components as required.
export { create, list, read, update, remove, follow, unfollow, findPeople }