# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Development stage: install all dependencies, compile TypeScript, and
# serve with hot-reload. Used directly in development via compose.yaml.
FROM node:24-alpine

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

# Once you create a package-lock.json by running npm install locally, switch to npm ci and bind both files:
RUN npm ci

# Copy the source code into the container and compile TypeScript.
COPY . .

RUN ng build

# Expose the port that the application listens on.
EXPOSE 4200

# Run the application in development mode.
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]