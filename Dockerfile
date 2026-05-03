# Dockerfile for frontend
FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE ${PORT:-3000}

CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
