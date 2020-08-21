/* To manage auth state in the frontend of the application, the frontend needs to be able to store, retrieve, and delete the auth credentials that are received from the server 
on successful user sign in. In our MERN applications, we will use the browser's sessionsStorage as the storage option to store the JWT auth credentials.

Alternatively, you can use localStorage instead of sessionStorage to store the JWT credentials. With sessionStorage, the user auth state will only be remembered in
the current window tab. With localStorage, the user auth state will be remembered across tabs in a browser.
*/

import { signout } from './api-auth.js'

const auth = {

    /* In the isAuthenticated() method, we can retrieve the stored credentials in sessionStorage to check if the current user is signed in.
    A call to isAuthenticated() will return either the stored credentials or false, depending on whether credentials were found in sessionStorage. 
    Finding credentials in storage will mean a user is signed in, whereas not finding credentials will mean the user is not signed in.
    */

    isAuthenticated() {
        if (typeof window == "undefined")
            return false

        if (sessionStorage.getItem('jwt'))
            return JSON.parse(sessionStorage.getItem('jwt'))
        else
            return false
    },

    /* To save the JWT credentials that are received from the server on successful sign-in, we use the authenticate method.
    The authenticate method takes the JWT credentials, jwt, and a callback function, cb, as arguments. It stores the credentials in sessionStorage after ensuring window is defined, 
    in other words ensuring this code is running in a browser and hence has access to sessionStorage. Then, it executes the callback function that is passed in. 
    This callback will allow the component – in our case, the component where sign-in is called – to define actions that should take place after successfully 
    signing in and storing credentials. 
    */

    authenticate(jwt, cb) {
        if(typeof window !== "undefined")
            sessionStorage.setItem('jwt', JSON.stringify(jwt))
        cb()
    },    

    /* When a user successfully signs out from the application, we want to clear the stored JWT credentials from sessionStorage.
    This clearJWT method takes a callback function as an argument, and it removes the JWT credential from sessionStorage. The passed in cb() function allows the component 
    initiating the signout functionality to dictate what should happen after a successful sign-out.
    
    The clearJWT method also uses the signout method we defined in api-auth.js to call the signout API in the backend. If we had used cookies to store the credentials
    instead of sessionStorage, the response to this API call would be where we clear the cookie. Using the signout API call is optional since this is dependent 
    on whether cookies are used as the credential storage mechanism.
    */

    clearJWT(cb) {
        if(typeof window !== "undefined")
            sessionStorage.removeItem('jwt')
        cb()
        
        //optional
        signout().then((data) => {
            document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        })
    }
}

export default auth
