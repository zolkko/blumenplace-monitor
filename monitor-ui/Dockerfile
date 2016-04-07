FROM alpine:3.3

RUN mkdir -p /var/www/static && \
    mkdir -p /var/www/static/fonts && \
    mkdir -p /var/www/static/images

COPY ./index.html /var/www

COPY ./static/app.js /var/www/static/app.js
COPY ./static/app.css /var/www/static/app.css

COPY ./static/fonts/icons.eot /var/www/static/fonts/icons.eot
COPY ./static/fonts/icons.woff2 /var/www/static/fonts/icons.woff2
COPY ./static/fonts/icons.woff /var/www/static/fonts/icons.woff
COPY ./static/fonts/icons.ttf /var/www/static/fonts/icons.ttf

VOLUME /var/www

ENTRY ["true"]

