FROM node:20

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

RUN npm install -g expo-cli

COPY . .

EXPOSE 19000 19001 19002

CMD ["npm", "start", "--tunnel"]