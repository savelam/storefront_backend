# Storefront Backend Project

# Getting Started

This project is to develop api endpoints for a small company to manage their online store. This api will help frontend developers to build their frontend
features to communicate with the backend database.

## How to setup and connect to the database

## What ports the backend and database are running on

This Project is run on port 5002 as defined in the .env file. However, if the .env file is not available, it could also run on port 3000.
The database is running on default postgresql port 5432

## Package Installation Instructions

When this project is downloaded, install all packages and dependencies by running the command
`npm install` this will insall all the packages in the package.json file.
To start the project, use the command
`npm run start`
To run a test, use the command
`npm run test`

## Database Schema

    Tables:
        users
        products
        orders
        order_products
