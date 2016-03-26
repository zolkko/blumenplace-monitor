FROM python:2.7-alpine

ENV PYTHONUNBUFFERED 1

RUN apk add --no-cache uwsgi uwsgi-python libffi openssl
RUN apk upgrade --no-cache

RUN mkdir /app
WORKDIR /app
ADD requirements.txt /app/

RUN set -x \
    && apk add --no-cache --virtual .build-deps  \
		gcc \
		libc-dev \
		linux-headers \
		make \
		openssl-dev \
		readline-dev \
        postgresql \
        postgresql-dev \
        libffi-dev \
        openssl-dev \
    && pip install -r requirements.txt \
    && apk del .build-deps

ADD . /app

EXPOSE 9000

CMD uwsgi --plugin=/usr/lib/uwsgi/python_plugin.so \
     --pythonpath=/usr/local/lib/python2.7 \
     --pythonpath=/usr/local/lib/python2.7/site-packages \
     --chdir=/app --master --module=wsgi:application \
     --socket=0.0.0.0:9000 --processes=4 --threads=2

