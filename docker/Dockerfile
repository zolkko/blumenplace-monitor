# build environment
FROM node:alpine as builder

# set working directory
RUN mkdir /app
WORKDIR /app

# add compiler
RUN apk add --no-cache build-base gcc musl-dev python

# install reason command line interface
# RUN npm install reason-cli@3.2.0-linux

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy package configuration files
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./webpack.config.js /app/webpack.config.js
COPY ./bsconfig.json /app/bsconfig.json

# copy application source codes
COPY ./src/ /app/src
COPY ./tests/ /app/tests

# install and cache app dependencies
RUN npm install

# build the application
RUN npm run build 
RUN npm run webpack:production

# production environment
FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d
COPY ./docker/conf /etc/nginx
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
