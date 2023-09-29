FROM node:latest
USER root
COPY package.json /app/
WORKDIR /app
ENV MONGODB_URL="mongodb+srv://SPM123:shehan123@fuelmgmt.cwfv9hk.mongodb.net/?retryWrites=true&w=majority"
RUN npm install
EXPOSE 22 6379 27017
CMD ["npm", "start"]
