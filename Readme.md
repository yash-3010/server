# Backend server for Pdf Modifier

# About

This is a backend server for the [Pdf Modifier](
https://github.com/yash-kreeti/pdf-modifier) project. It is written in Node.js and uses the [Express](https://expressjs.com/) framework.
Mongoose is used to connect to a MongoDB database. The server is hosted on [Heroku](https://www.heroku.com/). The server is used to store the user's data and to generate the modified pdf. The server also provides an API to generate a pdf from a url.

### The server is hosted at [https://pdf-modifier.herokuapp.com/](https://pdf-modifier.herokuapp.com/).


## Requirements

- Node.js - v20.7.0
- npm - 10.2.1

## Installation

1. Clone the repository
```bash
git clone https://github.com/yash-kreeti/server.git
```
2. Install the dependencies
```bash
npm install
```
3. Create a .env file in the root directory and add the following environment variables
```bash
MONGODB_URI=<your mongodb uri>

# For development
````

4. Start the server
```bash
node app.js
```

5. The server will be running at [http://localhost:4000/](http://localhost:4000/)

## Dependencies

- [Express](https://expressjs.com/) - Web framework for Node.js
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [Multer](https://www.npmjs.com/package/multer) - Node.js middleware for handling multipart/form-data
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a .env file
- [cors](https://www.npmjs.com/package/cors) - Node.js CORS middleware
- [pdf-lib](https://www.npmjs.com/package/pdf-lib) - PDF manipulation library
