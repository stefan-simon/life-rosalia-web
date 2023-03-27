# specify the node base image with your desired version node:<version>
FROM node:14

# create app directory
WORKDIR /app

# copy package.json and package-lock.json to work directory
COPY package*.json ./

# install app dependencies
RUN npm install

# copy app source code to work directory
COPY . .

RUN npm run build 

RUN npm install -g  serve

# expose port 3000
EXPOSE 3000

# start the app
CMD [ "serve", "-l", "3000", "-s", "build" ]
