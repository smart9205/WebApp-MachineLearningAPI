# build environment
FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json /app/
#RUN npm ci --silent
RUN npm install
RUN npm install react-scripts@3.4.3 -g --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY compose/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# #traefik
# FROM traefik:2.2

# RUN touch /acme.json \
#   && chmod 600 /acme.json


