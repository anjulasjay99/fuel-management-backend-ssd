# Secure Dockerfile for Backend.
FROM node:14.17.6

# Create app directory and set the user to non-root user
WORKDIR /app
USER node

# Use package lock file for deterministic builds
COPY --chown=node:node package*.json ./

# Install dependencies and run npm audit
RUN npm ci && npm audit fix

# Copy app source
COPY --chown=node:node . .

# Expose only necessary port
EXPOSE 8070

CMD ["npm", "start"]
