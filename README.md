# PERN For Soccer

This is PERN project for New soccer project

## Overview

Here stands the overview of this project.

## Abbreviations Used

PERN = (PostgreSQL, Express JS, React, Node.JS)

## Development
- Backend development
```
cd api
npm run start:dev
```
- Frontend development
```
cd app
npm start
```
## How to deploy in prod server



### Dependancies

You will need to install:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.JS / NPM](https://nodejs.org/en/download/)

### Controls

Starts Docker containers and networks (will build first if no build exists):

```
npm run docker:up
```

Builds Docker images from a docker-compose.yml, Dockerfile and "context";

```
npm run docker:build
```

Stops Docker containers and networks:

```
npm run docker:down
```

## Technologies Used

- Docker
- PostgreSQL
- Express JS
- React
- Node JS


