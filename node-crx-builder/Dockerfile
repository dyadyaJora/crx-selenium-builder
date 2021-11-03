FROM node:12
WORKDIR /app
COPY ./.env.sample .env
COPY index.js index.js
COPY package.json package.json
RUN npm install
CMD node index.js
