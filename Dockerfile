FROM node:10.20.1-jessie-slim

EXPOSE 3000

WORKDIR /opt/app/myspecialway
COPY yarn.lock package.json ./
RUN yarn --production
COPY ./dist ./

ENTRYPOINT node main