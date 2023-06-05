# Build Image
FROM node:19-alpine AS BUILD_IMAGE

WORKDIR /app

# Couchbase sdk requirements
RUN apk update && apk add yarn curl bash && rm -rf /var/cache/apk/*


# Install dependencies
COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile --production

# Copy source code
COPY . .

# Build
RUN yarn build

# Prune dev dependencies
## Using npm prun
RUN npm prune --omit=dev

## Unsing node-prune
RUN npm install -g node-prune
RUN node-prune

# Run Image
FROM node:19-alpine

WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app/.output ./.output
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

EXPOSE 3000 3001 3002

ENTRYPOINT ["node", ".output/server/index.mjs"]