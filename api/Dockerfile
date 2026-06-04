FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npx prisma generate && npm run build

EXPOSE 3010

CMD ["npm", "run", "docker:start"]