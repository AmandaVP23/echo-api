# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies with Yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the entire project
COPY . .

RUN mkdir -p uploads

# Build the NestJS app
RUN yarn build

# Expose the port your NestJS app runs on
# EXPOSE 3001

# Start the application
CMD ["yarn", "start"]
