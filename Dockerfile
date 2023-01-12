FROM node:18-alpine AS base

WORKDIR /user/src/app

COPY package*.json ./

RUN npm ci

EXPOSE 3000

COPY . .

RUN npm run build

RUN apk add ffmpeg --no-cache

CMD ["node", "dist/main"]