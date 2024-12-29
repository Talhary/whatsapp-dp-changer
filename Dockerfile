# Use the official Node.js image.
FROM node:22

# Set the working directory.
WORKDIR /

# Copy the package.json and package-lock.json.
COPY package*.json ./

# Install dependencies with --force.
RUN npm install --force

# Copy the application code.
COPY . .

# Expose the application port.
EXPOSE 3000

# Define the command to run the app.
CMD ["npm", "start"]
