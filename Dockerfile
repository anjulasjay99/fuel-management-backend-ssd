# Secure Dockerfile for Backend.
FROM node:lts-alpine@sha256:b2da3316acdc2bec442190a1fe10dc094e7ba4121d029cb32075ff59bb27390a

# Create app directory and set the user to non-root user
WORKDIR /app
USER node

# Use package lock file for deterministic builds
COPY --chown=node:node package*.json ./

# Install dependencies and run npm audit
RUN npm ci && npm audit fix

# Use ARG to pass environment variable at build time or use env file or orchestration secrets (Kubernetes, Docker Swarm, etc.) at runtime.
# Don't hardcode sensitive information in Dockerfile
ARG MONGODB_URL
ENV MONGODB_URL=$MONGODB_URL

# Copy app source
COPY --chown=node:node . .

# Expose only necessary port
EXPOSE 8070

CMD ["npm", "start"]
