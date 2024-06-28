# DZ Stores Database

A Node.js application for managing a stores database in Algeria, where each store can maintain its own social media presence. This project uses Express, TypeScript, and MongoDB to create a robust and scalable backend solution.

## Table of Contents

- [DZ Stores Database](#dz-stores-database)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Environment Variables](#environment-variables)
  - [Testing](#testing)
  - [Docker](#docker)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/dz-stores-db.git
   cd dz-stores-db
   ```

   Install dependencies:
   `    npm install
`

2. Set up environment variables. Create a .env file in the root directory and add the following:

   ```
   DB_URI=mongodb://localhost:27017/stores_DZ
   HASH_=14
   NODE_ENV=development
   PORT=8080
   DOMAIN=localhost:8080
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   SERVICE_EMAIL=gmail
   REDIS_URL=redis://127.0.0.1:6379
   ```

3. Start the server:
   `   npm start`

## Usage

To start the server in production mode:
`   npm start
  `

## API Endpoints

1. Authentication

   - POST /auth/signp - Register a new user
   - POST /auth/login - Log in an existing user
   - GET /auth/verify - activate the user account
   - POST /auth/forgotPassword - forgot password
   - POST /auth/verifyResetCode - verify the token sent
   - PUT /auth/change-password - change a user password

1. Stores

   - GET /stores/ - Get all stores
   - GET /stores/:id - Get a specific store by ID
   - POST /stores - Create a new store
   - PUT /stores/:id - Update a store by ID
   - DELETE /stores/:id - Delete a store by ID
   - GET /stores/filter-by-wilaya
   - GET /stores/search
   - GET /stores/search-by-name
   - GET /stores/:storeId/images
   - GET /stores/:storeId/reviews
   - DELETE /stores/:storeId/reviews/:reviewId

## Environment Variables

Ensure you have the following environment variables set in your .env file:

```
DB_URI=mongodb://localhost:27017/stores_DZ
HASH_=14
NODE_ENV=development
PORT=8080
DOMAIN=localhost:8080
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
SERVICE_EMAIL=gmail
REDIS_URL=redis://127.0.0.1:6379
```

## Testing

Run tests using Jest:

```
npm run test
```

## Docker

1. To run the application with Docker:

   Build the Docker image:

   ```
   docker build -t dz-stores-db .
   ```

2. Run the Docker container:
   ```
   docker-compose up
   ```

## Project Structure

```
.
├── docker-compose.yml
├── Dockerfile
├── jest.config.ts
├── jest.setup.ts
├── package.json
├── package-lock.json
├── private.key
├── public.key
├── README.MD
├── refTokenPrivate.key
├── refTokenPublic.key
├── src
│   ├── app.ts
│   ├── config
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   └── store.controller.ts
│   ├── middleware
│   │   ├── authorization.ts
│   │   ├── cache.ts
│   │   ├── checkAuth.ts
│   │   ├── errorMiddleware.ts
│   │   ├── rate-limit.ts
│   │   ├── upload.ts
│   │   └── validator.ts
│   ├── models
│   │   ├── store.model.ts
│   │   └── user.model.ts
│   ├── resources-schema
│   │   ├── store.schema.ts
│   │   └── user.schema.ts
│   ├── router.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   └── store.routes.ts
│   ├── server.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   └── store.service.ts
│   ├── __tests__
│   │   └── auth.test.ts
│   └── utils
│       ├── apiError.ts
│       ├── connect.db.ts
│       ├── jwt.utils.ts
│       ├── logger.ts
│       ├── mailer.ts
│       └── types.ts
├── tsconfig.json
└── uploads
    └── logo

```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.
