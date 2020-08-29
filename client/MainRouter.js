/* The MainRouter.js code will help render our custom React components with respect to the routes or locations in the application.
*/

import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'

/* The Switch component in React Router renders a route exclusively. In other words, it only renders the first child that matches the
requested route path. On the other hand, without being nested in a Switch, every Route component renders inclusively when there is a
path match; for example, a request at '/' also matches a route at '/contact'.

To add the EditProfile component to the app, we will use a PrivateRoute, which will restrict the component from loading at all if the user is not signed in. 
The order of placement in MainRouter will also be important. The route with the '/user/edit/:userId' path needs to be placed before the route with the '/user/:userId' path, 
so that the edit path is matched first exclusively in the Switch component when this route is requested, and not confused with the Profile route.

Since we are using the DeleteUser component in the Profile component, it gets added to the application view when Profile is added in MainRouter.

To have the Menu navigation bar present in all the views, we need to add it to the MainRouter before all the other routes, and outside the Switch component.
This will make the Menu component render on top of all the other components when these components are accessed at their respective routes.
*/
const MainRouter = () => {
    return (<div>        
        <Menu/>
        <Switch>
            <Route exact path="/" component={Home}/> 
            <Route path="/users" component={Users}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/signin" component={Signin}/>
            <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
            <Route path="/user/:userId" component={Profile}/>
        </Switch>
    </div>
    )
}

export default MainRouter