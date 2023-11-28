FROM node:18.8

# Create app directory
WORKDIR /usr/src/appp
COPY package*.json ./

RUN npm install

ENV NEXT_PUBLIC_HOST=http://172.16.61.69:9000
ENV NEXT_PUBLIC_EDITOR_HOST=http://172.16.61.69:4201

COPY pages/ pages/
COPY public/ public/
COPY styles/ styles/
COPY *.json ./
COPY .env.local ./
COPY *.ts ./
COPY *.js ./
COPY yarn.lock ./

RUN npm run build


EXPOSE 3000
CMD [ "npm", "run", "start" ]
