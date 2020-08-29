import config from './../config/config' // import the config variables to set the port number that the server will listen on
import app from './express' // import the configured Express app to start the server
import mongoose from 'mongoose' // import the mongoose module. To learn more about Mongoose, visit mongoosejs.com

// Connection URL
mongoose.Promise = global.Promise // onfigure it so that it uses native ES6 promises

// use it to handle the connection to the MongoDB database for the proyect
mongoose.connect(config.mongoUri, { useNewUrlParser: true,
                                    useCreateIndex: true,
                                    useUnifiedTopology: true,
                                    useFindAndModify: false })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

/* With the Express app configured to accept HTTP requests, we can go ahead and use it to implement a server that can listen for incoming requests.
First, we import the config variables to set the port number that the server will listen on and then import the configured Express app to start the server. 
*/
app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})


