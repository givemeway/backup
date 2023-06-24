FROM node:18.16.1-bullseye-slim As build 
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["node","server.js"]
EXPOSE 3000

# FROM alpine:3.14
# WORKDIR /app
# COPY . .
# RUN apk update && \
#     apk add curl mysql mysql-client && \
#     addgroup -g 1001 -S mygroup && \
#     adduser -u 1001 -S -D -H -h /var/lib/mysql -s /sbin/nologin -G mygroup -g mygroup myuser && \
#     mkdir /run/mysqld && \
#     chown -R mysql:mysql /run/mysqld && \
#     curl -fsSLO --compressed "https://unofficial-builds.nodejs.org/download/release/v18.16.0/node-v18.16.0-linux-x64-musl.tar.xz" && \
#     tar -xJf "node-v18.16.0-linux-x64-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner && \
#     rm "node-v18.16.0-linux-x64-musl.tar.xz" && \
#     echo -e "[mysqld]\nuser = mysql" >> /etc/my.cnf
# ENV NODE_ENV=production
# RUN npm install --production
# CMD ["node","server.js"]
# EXPOSE 3000