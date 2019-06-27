# Check out https://hub.docker.com/_/node to select a new base image
FROM node:8.15.1-alpine

# Set to a non-root built-in user `node`
ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory (with user `node`)

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install Alpine Dependencies
RUN apk add --virtual .build-deps make gcc g++ python

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source code
COPY . .

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV PORT=3001

EXPOSE ${PORT}
CMD [ "node", "." ]
