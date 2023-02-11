# base node image
FROM node:18-alpine as base

# set for base and all layer that inherit from it
ENV NODE_ENV production
ENV CI true

# install pnpm
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm turbo

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /srv/app

ADD package.json .npmrc apps/**/package.json packages/**/package.json ./
RUN pnpm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /srv/app

COPY --from=deps /srv/app/node_modules /srv/app/node_modules
ADD package.json .npmrc ./
RUN pnpm prune --production

# Build the app
FROM base as build

WORKDIR /srv/app

COPY --from=deps /srv/app/node_modules /srv/app/node_modules

ADD . .
RUN pnpm build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /srv/app

COPY --from=production-deps /srv/app/node_modules /srv/app/node_modules

COPY --from=build /srv/app/{apps,packages}/**/{build,dist} /srv/app/{apps,packages}/**/{build,dist}
COPY --from=build /srv/app/{apps,packages}/**/package.json /srv/app/{apps,packages}/**/package.json

COPY --from=build /srv/app/package.json /srv/app/package.json

ADD . .

CMD ["pnpm", "serve"]
