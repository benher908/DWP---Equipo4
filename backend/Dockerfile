# build a simple Node.js image for the backend
FROM node:20-alpine

# working directory inside container
WORKDIR /app

# copy only package files first for caching installs
COPY package*.json ./

# install dependencies (production or dev depending on NODE_ENV)
RUN npm install

# copy rest of backend sources
COPY . .

# expose port the server listens on
EXPOSE 3010

# use nodemon in development, fallback to node when not available
CMD ["npm", "run", "dev"]
