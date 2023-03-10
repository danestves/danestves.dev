# base node image
FROM node:18-alpine as base

# set for base and all layer that inherit from it
ENV NODE_ENV production
ENV CI true

# install pnpm
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm turbo dotenv-cli

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /srv/app

ADD package.json pnpm-workspace.yaml .npmrc ./

ADD apps/server/package.json ./apps/server/package.json
ADD apps/web/package.json ./apps/web/package.json
ADD apps/web/other/patches ./apps/web/other/patches
ADD packages/eslint-config/package.json ./packages/eslint-config/package.json
ADD packages/prettier-config/package.json ./packages/prettier-config/package.json

RUN pnpm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /srv/app

COPY --from=deps /srv/app/node_modules /srv/app/node_modules
COPY --from=deps /srv/app/apps/server/node_modules /srv/app/apps/server/node_modules
COPY --from=deps /srv/app/apps/web/node_modules /srv/app/apps/web/node_modules

ADD package.json pnpm-workspace.yaml .npmrc ./
ADD apps/server/package.json ./apps/server/package.json
ADD apps/web/package.json ./apps/web/package.json
ADD apps/web/other/patches ./apps/web/other/patches

RUN pnpm prune --production

# Build the app
FROM base as build

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

WORKDIR /srv/app

COPY --from=deps /srv/app/node_modules /srv/app/node_modules
COPY --from=deps /srv/app/apps/server/node_modules /srv/app/apps/server/node_modules
COPY --from=deps /srv/app/apps/web/node_modules /srv/app/apps/web/node_modules
COPY --from=deps /srv/app/packages/eslint-config/node_modules /srv/app/packages/eslint-config/node_modules
COPY --from=deps /srv/app/packages/prettier-config/node_modules /srv/app/packages/prettier-config/node_modules

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ADD . .
RUN pnpm build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /srv/app

COPY --from=production-deps /srv/app/node_modules /srv/app/node_modules
COPY --from=production-deps /srv/app/apps/server/node_modules /srv/app/apps/server/node_modules
COPY --from=production-deps /srv/app/apps/web/node_modules /srv/app/apps/web/node_modules

COPY --from=build /srv/app/apps/web/build /srv/app/apps/web/build
COPY --from=build /srv/app/apps/web/public /srv/app/apps/web/public
COPY --from=build /srv/app/apps/web/express.js /srv/app/apps/web/express.js

COPY --from=build /srv/app/apps/server/dist /srv/app/apps/server/dist

COPY --from=build /srv/app/package.json /srv/app/package.json
COPY --from=build /srv/app/apps/server/package.json /srv/app/apps/server/package.json
COPY --from=build /srv/app/apps/web/package.json /srv/app/apps/web/package.json

EXPOSE ${PORT}

CMD ["node", "--conditions=serve", "apps/server/dist/index.js"]
