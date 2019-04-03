FROM node:10-alpine

COPY package.json /usr/src/app/package.json
WORKDIR /usr/src/app
RUN yarn install

COPY . /usr/src/app

RUN yarn run build

EXPOSE 3000
CMD ["yarn", "run", "start:prod"]