FROM alpine:3.3

RUN mkdir /var/www && mkdir /var/www/js

COPY ./signin.html /var/www
COPY ./index.html /var/www

COPY ./static/js/signin.js /var/www/js/signin.js
COPY ./static/css/signin.js /var/www/css/signin.js

COPY ./static/js/main.js /var/www/js/main.js
COPY ./static/css/main.css /var/www/css/main.css

VOLUME /var/www

ENTRY ["true"]
