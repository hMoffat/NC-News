# Northcoders News API

See a hosted instance here: https://nc-news-zs8x.onrender.com/api

## What is it?

A social news API with rated articles which can be organised by topic and with discussion via comments. Users can vote on articles and comments.

### Minimum Requirements

Node.js: v20.8.0.
Postgres: ^8.7.3

## Cloning

In your chosen local directory, run `git clone https://github.com/hMoffat/NC-News.git`

## Installing dependencies

To install the dependencies listed in the repo's package.json:

- run `npm install`

## Seeding a local database

To create the databases run `npm setup-dbs`.

Then to seed the development database run `npm run seed`.

The test database is seeded with test data each time the test suit is run.

## Running tests

Running `npm test` will run all test suits which includes a utils unit test and an app test.

## Creating global environment variables to run the project locally

Two files must be added at the root of your clone of the repo:

- .env.test
- .env.development

Each should contain the "PGDATABASE=" global variable with the relavent database assigned (these can be found in '/db/setup.sql').

These set the relavent database depending on whether you are running tests or working on development. The logic for this is managed in the connection file.

These .env files should be added to your .gitignore file.

If you were to host an instance you would also need to include global variable for this set to the url in a .env file. To ensure this is not exposed when changes are pushed to your git repo, also include this file in the .gitignore file.
