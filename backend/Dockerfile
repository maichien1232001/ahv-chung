# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk --no-cache add g++ make python3 git

COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

COPY . .
RUN yarn build

# Loại bỏ devDependencies để giảm dung lượng
RUN yarn install --pure-lockfile --production --force

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN apk --no-cache add curl && rm -rf /var/cache/apk/*

CMD ["node", "dist/index.js"]