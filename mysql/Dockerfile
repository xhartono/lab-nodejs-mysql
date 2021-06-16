## Pull the mysql:5.7 image
FROM mysql:5.7

## The maintainer name and email
MAINTAINER hartono kurniawan (xhartono@gmail.com)

# database = test and password for root = password
ENV MYSQL_DATABASE=sistradb \
    MYSQL_ROOT_PASSWORD=inix2021

# when container will be started, we'll have `test` database created with this schema
COPY ./test-dump.sql /docker-entrypoint-initdb.d/
