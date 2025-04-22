# Use official Node.js image
FROM node:22-alpine

WORKDIR /app

COPY ./Backend/package.json ./Backend/package-lock.json /app/Backend/
COPY ./Frontend/package.json ./Frontend/package-lock.json /app/Frontend/


COPY ./Backend /app/Backend/
COPY ./Frontend ./Frontend/.env /app/Frontend/

RUN cd /app/Backend/ && npm install
RUN cd /app/Frontend/ && npm install

# Build the frontend application
RUN cd /app/Frontend/ && npm run build

# Set environment variable for the port
ARG PORT=8080
ENV PORT=$PORT

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "/app/Backend/server.js"]
