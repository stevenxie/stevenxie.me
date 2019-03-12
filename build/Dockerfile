###################
## BUILDER IMAGE
###################
FROM node:10-alpine AS builder

## Install build dependencies.
RUN apk --update add make

## Copy source, install dependencies.
WORKDIR /build/
COPY . .
RUN make install

## Build for production.
RUN make build


######################
## PRODUCTION IMAGE
######################
FROM node:10-alpine AS production

ARG BUILD_VERSION="unset"

## Labels:
LABEL maintainer="Steven Xie <hello@stevenxie.me>"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.name = "stevenxie/stevenxie.me"
LABEL org.label-schema.url="https://stevenxie.me/"
LABEL org.label-schema.description="Web Frontend Server"
LABEL org.label-schema.vcs-url="https://github.com/stevenxie/stevenxie.me"
LABEL org.label-schema.version="$BUILD_VERSION"

## Setup environment.
ENV PORT=80 NODE_ENV=production

## Copy built application and package metadata.
WORKDIR /app
COPY --from=builder /build/.ream/ .ream/
COPY --from=builder /build/public/ public/
COPY --from=builder /build/package.json .

## Install ream.
RUN yarn add "ream@$(node -p "require('./package.json').dependencies.ream")"

## Define healthcheck.
COPY ./scripts/healthcheck.sh /usr/bin/healthcheck.sh
ENV HEALTH_ENDPOINT=http://localhost:80
HEALTHCHECK --interval=30s --timeout=30s --start-period=15s --retries=1 \
  CMD [ "healthcheck.sh" ]

## Expose port, entrypoint.
EXPOSE 80
ENTRYPOINT yarn ream start
