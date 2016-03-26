FROM nginx:stable-alpine
RUN  mkdir /var/www
COPY nginx.conf /etc/nginx/nginx.conf
COPY 404.html /var/www/404.html
COPY 50x.html /var/www/50x.html
EXPOSE 80
