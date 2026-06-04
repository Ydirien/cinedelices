FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

# Regénère le client Prisma depuis le schéma avant la compilation TypeScript
RUN npx prisma generate

RUN npm run build

EXPOSE 3010

CMD ["npm", "run", "docker:start"]