# Use official Node.js image
FROM node:22-alpine

WORKDIR /app

COPY package.json ./ 

RUN npm install

COPY . .

ARG PORT=5000
ENV PORT=$PORT

EXPOSE 5000

CMD ["node", "agent_server_d.js"]
