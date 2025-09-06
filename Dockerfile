FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install --force

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]