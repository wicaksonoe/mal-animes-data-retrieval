FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package.json
RUN yarn

COPY . .

RUN yarn build

CMD ["node", "dist/index.js"]
