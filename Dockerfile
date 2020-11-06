# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
EXPOSE 4000
CMD [ "npm", "start" ]
