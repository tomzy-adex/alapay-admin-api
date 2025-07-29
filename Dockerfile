# Use the official Node.js image as the base image
FROM node:18-alpine

# Install necessary dependencies for bcrypt and node-gyp
RUN apk add --no-cache python3 make g++

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 6525

# Run migrations before starting the app
CMD ["npm", "run", "start:prod"]
