# Use the official Node.js image from the Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /app/order-service

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Set the environment variables (assuming you have .env file)
COPY ./.env ./.env

# Expose the application port (assuming your app runs on port 3002)
EXPOSE 3002

# Start the application
# RUN node auth.server.js
CMD [ "node", "order.server.js" ]
