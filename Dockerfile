FROM node:7.5.0
WORKDIR /OnTap
COPY ./package.json .
RUN npm i
COPY . /OnTap
RUN npm run gulp
CMD node /OnTap/dist/server/app.js
