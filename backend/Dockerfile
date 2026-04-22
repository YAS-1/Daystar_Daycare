# Uses the node version 22 as the base image
FROM node:22

# Sets the working directory to /app
WORKDIR /backend

# Copies package.json and package-lock.json to the working directory
COPY package*.json ./

# Installs the dependencies
RUN npm install

# Copies the rest of the files to the working directory
COPY . .

# Set the port evironment variable
ENV PORT=3337

# Exposes port 3000
EXPOSE 3337

# Run the server
CMD [ "npm", "run" ,"dev" ]


