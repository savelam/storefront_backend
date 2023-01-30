# apifront Backend Project

# Getting Started

This project is to develop api endpoints for a small company to manage their online api. This api will help frontend developers to build their frontend features to communicate with the backend database.

## How to setup and connect to the database

## What ports the backend and database are running on

This Project is run on port 5002 as defined in the .env file. However, if the .env file is not available, it could also run on port 5000.
The database is running on default postgresql port 5432

## Package Installation Instructions

When this project is downloaded, install all packages and dependencies by running the command
`npm install` this will insall all the packages and dependencies in the package.json file.

- Connect to the postgres in the terminal by running <code>psql</code>
- Run the following command to create postgres user by running the command <code>CREATE USER store_front_backend_user WITH PASSWORD 'store_front_backend_password';</code>
- Create the database for both the dev and the test using the command <code>CREATE DATABASE store_front_backend;</code> and <code>CREATE DATABASE store_front_backend_test;</code>
- Grant access to the database by the user you created above using the following commands
  <code>GRANT ALL PRIVILEGES ON DATABASE store_front_backend TO store_front_backend_user;</code> and <code>GRANT ALL PRIVILEGEPOSS ON DATABASE store_front_backend_test TO store_front_backend_user;</code>
- In the root directory of the code, locate <code>database.json</code> file. Set the parameters to match the the databasename, password and user.
- Rename the <code>.env.example</code> to <code>.evn</code> and fill in the parameters to match the actuals
- Run the migration command to migrate the database.

To start the project, use the command
`npm run start`
To run a test, use the command
`npm run test`

## Running The Server

To start the server. run the command <code>npm run watch</code>. After the code runs you will see <a href="http://localhost:5000">http://localhost:5000</a>

##### Eslint

The typescript can be compiled by running the command.<code>npm run tsc</code>. That should create a build into the <code>/build</code> directory.

##### Jasmine

Run your test using Jasmin command.<code>npm run test</code>.

##### Eslint

The eslint configurations is ran using the command.<code>npm run lint</code>.

##### Prettier

To format the code in the right format, run the command <code>npm run format</code>.

##### Migrate Database

To perform a database migration, Enter the command <code>npm run migrate</code>.

## Database Schema

    Tables:
        users
        products
        orders
        order_products

## API endpoints

#### Products Endpoint

- All products in the database can be accessed on the endpoint <a href="http://localhost:5000/api/products">http://localhost:5000/api/products</a>. A json array of all products should display as a response if products exists in the database, if there are no products, an empty json array will display.
- To view a single product, you have to access the <a href="http://localhost:5000/api/products/:id">http://localhost:5000/api/products/:id</a> The Id is the id of the product you want to display.
- Product creation is done using the endpoint <a href="http://localhost:5000/api/products">http://localhost:5000/api/products</a> But with a POST http Verb.
- To delete a product, use the endpoint <a href="http://localhost:5000/api/products/:id">http://localhost:5000/api/products/:id</a> with a DELETE http VERB.

#### Endpoint for Orders

- All orders in the database can be accessed on the endpoint <a href="http://localhost:5000/api/orders">http://localhost:5000/api/orders</a>.A json array of all orders should display as a response if products exists in the database, if there are no products, an empty json array will display.
- To orders with a particular status can be accessed here <a href="http://localhost:5000/api/orders/:status/order-status">http://localhost:5000/api/orders/:status/order-status</a>
- Products can be added to orders using the endpoint <a href="http://localhost:5000/api/order/product'">http://localhost:5000/api/order/product'</a>

#### User Endpoint

- Endpoint to view all users can be accessed here <a href="http://localhost:5000/api/users">http://localhost:5000/api/users</a>. A json array of array of objects containning the users will be displayed.
- A single user can be accessed on the endpoint <a href="http://localhost:5000/api/users/:id">http://localhost:5000/api/users/:id</a> [where **id** = the **id** of the user you want].
- A new user can be created usin the endpoint <a href="http://localhost:5000/api/users">http://localhost:3000/api/users</a> a POST http VERB should be used to achieve this.
