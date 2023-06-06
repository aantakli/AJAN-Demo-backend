FROM node:18.8

# Create app directory
WORKDIR /usr/src/appp
COPY package*.json ./

RUN npm install

COPY pages/ pages/
COPY public/ public/
COPY styles/ styles/
COPY *.json ./
COPY .env ./
COPY *.ts ./
COPY *.js ./
COPY yarn.lock ./

RUN npm run build


EXPOSE 3000
CMD [ "npm", "run", "start" ]
