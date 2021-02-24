FROM node:12.13-alpine

RUN mkdir /home/node/app
WORKDIR /home/node/app

ADD package*.json /home/node/app

RUN npm install

ADD . /home/node/app

CMD ["npm", "run", "start:dev"]
EXPOSE 3000
