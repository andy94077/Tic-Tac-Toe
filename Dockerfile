FROM node:12.18.2-alpine
WORKDIR /app
#ENV PATH="/app/node_modules/.bin:$PATH"
COPY package.json .
RUN npm install
RUN npm install -g serve

COPY . ./

RUN npm run build
EXPOSE 8888

CMD ["serve","-s","build","-l","8888"]