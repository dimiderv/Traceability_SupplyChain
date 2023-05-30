FROM node:14.17.6

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm","run", "server"] 