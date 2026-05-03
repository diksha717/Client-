# Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:migrate

EXPOSE 5000

CMD ["npm", "start"]
