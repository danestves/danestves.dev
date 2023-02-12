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

ADD apps/cms/package.json ./apps/cms/package.json
ADD apps/server/package.json ./apps/server/package.json
ADD apps/web/package.json ./apps/web/package.json
ADD packages/eslint-config/package.json ./packages/eslint-config/package.json
ADD packages/prettier-config/package.json ./packages/prettier-config/package.json

RUN pnpm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /srv/app

COPY --from=deps /srv/app/node_modules /srv/app/node_modules
COPY --from=deps /srv/app/apps/cms/node_modules /srv/app/apps/cms/node_modules
COPY --from=deps /srv/app/apps/server/node_modules /srv/app/apps/server/node_modules
COPY --from=deps /srv/app/apps/web/node_modules /srv/app/apps/web/node_modules

ADD package.json pnpm-workspace.yaml .npmrc ./
ADD apps/cms/package.json ./apps/cms/package.json
ADD apps/server/package.json ./apps/server/package.json
ADD apps/web/package.json ./apps/web/package.json

RUN pnpm prune --production

# Build the app
FROM base as build

WORKDIR /srv/app

COPY --from=deps /srv/app/node_modules /srv/app/node_modules
COPY --from=deps /srv/app/apps/cms/node_modules /srv/app/apps/cms/node_modules
COPY --from=deps /srv/app/apps/server/node_modules /srv/app/apps/server/node_modules
COPY --from=deps /srv/app/apps/web/node_modules /srv/app/apps/web/node_modules
COPY --from=deps /srv/app/packages/eslint-config/node_modules /srv/app/packages/eslint-config/node_modules
COPY --from=deps /srv/app/packages/prettier-config/node_modules /srv/app/packages/prettier-config/node_modules

ARG TURBO_TEAM
RUN echo "TURBO_TEAM=$TURBO_TEAM"
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
RUN echo "TURBO_TOKEN=$TURBO_TOKEN"
ENV TURBO_TOKEN=$TURBO_TOKEN

ADD . .
RUN turbo run build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /srv/app

COPY --from=production-deps /srv/app/node_modules /srv/app/node_modules
COPY --from=production-deps /srv/app/apps/cms/node_modules /srv/app/apps/cms/node_modules
COPY --from=production-deps /srv/app/apps/server/node_modules /srv/app/apps/server/node_modules
COPY --from=production-deps /srv/app/apps/web/node_modules /srv/app/apps/web/node_modules

COPY --from=build /srv/app/apps/cms/build /srv/app/apps/cms/build
COPY --from=build /srv/app/apps/server/build /srv/app/apps/server/build
COPY --from=build /srv/app/apps/web/build /srv/app/apps/web/build
COPY --from=build /srv/app/apps/web/public /srv/app/apps/web/public
COPY --from=build /srv/app/apps/web/express.js /srv/app/apps/web/express.js

COPY --from=build /srv/app/apps/cms/dist /srv/app/apps/cms/dist
COPY --from=build /srv/app/apps/server/dist /srv/app/apps/server/dist

COPY --from=build /srv/app/package.json /srv/app/package.json
COPY --from=build /srv/app/apps/cms/package.json /srv/app/apps/cms/package.json
COPY --from=build /srv/app/apps/server/package.json /srv/app/apps/server/package.json
COPY --from=build /srv/app/apps/web/package.json /srv/app/apps/web/package.json

ENV PAYLOAD_CONFIG_PATH="apps/cms/dist/payload.config.js"

EXPOSE ${PORT}

CMD ["node", "--conditions=serve", "apps/server/dist/index.js"]
