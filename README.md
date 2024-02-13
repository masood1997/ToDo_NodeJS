# Todo Server

This is a backend server for managing todo tasks built with Node.js and Express.

## Table of Contents

- [Todo Server](#todo-backend-server)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Endpoints](#endpoints)
  - [Contributing](#contributing)
  - [License](#license)

## About

The Todo Backend Server is a RESTful API server designed to manage todo tasks. It provides endpoints for creating, reading, updating, and deleting todo items, as well as user authentication and authorization using JSON Web Tokens (JWT).

## Tech Stack

**Server:** Node, Express

## Features

- User authentication and authorization using JWT
- CRUD operations for todo tasks
- Secure password hashing with bcrypt
- MongoDB integration using Mongoose
- Environment variable management with dotenv
- Automatic server restarts with nodemon

## Dependencies

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For generating and verifying JWT tokens for user authentication.
- [nodemon](https://www.npmjs.com/package/nodemon): For automatically restarting the server during development.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): For parsing cookies attached to incoming requests.
- [bcrypt](https://www.npmjs.com/package/bcrypt): For securely hashing user passwords before storing them in the database.
- [mongoose](https://www.npmjs.com/package/mongoose): For interacting with MongoDB, providing a schema-based solution to model your application data.
- [dotenv](https://www.npmjs.com/package/dotenv): For loading environment variables from a .env file into process.env.

## Installation

1. Clone the repository:
``` bash
  git clone https://github.com/masood1997/ToDo_NodeJS
```
2. Navigate to the project directory:
``` bash
  cd todo-backend-server
```

3. Install dependencies:
``` bash
  npm install
```

4. Set up environment variables: 
- Create a .env file in the root directory and add the following variables:
``` bash
    PORT=3000
    MONGODB_URI=<your-mongoDB-connection-string>
    JWT_SECRET=<your-secret-key>
```

## Usage
Start the server:
``` bash
  npm start
```
The server will start running on the specified port (default is 6000).

## Endpoints
- POST /api/v1/user/register: Register a new user.
- POST /api/v1/user/login: Log in and receive a JWT token.
- GET /api/v1/task/myTasks: Get all todo tasks for the authenticated user.
- POST /api/v1/task/new: Create a new todo task.
- GET /api/v1/task/:id: Get a specific todo task.
- PUT /api/v1/task/:id: Update a specific todo task.
- DELETE /api/v1/task/:id: Delete a specific todo task.
For detailed information on request and response formats, refer to the API documentation.

## Contributing
Contributions are welcome! Please follow the contribution guidelines.


## License

[MIT](https://choosealicense.com/licenses/mit/)

This project is licensed under the MIT License - see the LICENSE file for details.
## Authors

- [@masoodrehman1997](https://www.github.com/masoodrehman1997)


## 🚀 About Me
I'm a full stack developer. A Computer Science graduate and a passionate programmer with a strong background in Algorithms and Data Structures.

