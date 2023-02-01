# API Requirements

The owners of the business wish to set up an online storefront to display their fantastic product concepts. Users must be able to browse a list of all available products, examine a product's details, and add items to an order that they can later view in their shopping cart. Your coworker is building the frontend, and you have been given the duty of creating the API that will support this application.

These are the notes from a meeting with the front-end developer that outline the endpoints the API must provide and the data types that both the front-end and the back-end have agreed satisfy the application's demands.

## Our API Endpoints

### User routes

- '/api/users' [GET]

- '/api/users/:id' [GET]

- '/api/users' [POST]

### Product Routes

- '/api/products' [GET]

- '/api/products/:id' [GET]

- '/api/products' [POST]

- '/api/products/:id' [PUT]

- '/api/products/:id' [DELETE]

### Orders routes

'/api/orders' [GET]

'/api/orders/:status/order-status' [GET]

'/api/order/product' [POST]

### Authentication routes

'/api/auth/?password' [GET]

## Data Schema

### Product

- id [INTEGER] [PRIMARY KEY],
- name [VARCHAR],
- available_quantity [INTEGER],
- price [INTEGER]

### User

- id [INTEGER][PRIMARY KEY],
- username [VARCHAR],
- first_name [VARCHAR],
- last_name [VARCHAR],
- password [VARCHAR]

### Orders

- id [INTEGER][PRIMARY KEY],,
- status [VARCHAR],
- user_id [INTEGER]

### Orders_Products

- id [INTEGER][PRIMARY KEY],
- quantity [INTEGER],
- order_id [INTEGER],
- product_id [INTEGER]
