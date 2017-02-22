FROM node:7.5.0
WORKDIR /OnTap
COPY . /OnTap
RUN npm i
RUN npm run gulp
CMD node /OnTap/dist/server/app.js
