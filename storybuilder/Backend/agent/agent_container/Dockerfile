# Use official Node.js image
FROM node:18

WORKDIR /app

COPY package.json ./ 

RUN npm install

COPY . .

ARG PORT=5000
ENV PORT=$PORT

EXPOSE 5000

CMD ["node", "agent_server.js"]
