FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm  install && apk add bash

COPY . .

EXPOSE 4000

CMD [ "npm", "start"]