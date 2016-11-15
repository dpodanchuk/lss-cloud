#FROM softsky/kali-linux-full
FROM node

MAINTAINER Arsen A.Gutsal <gutsal.arsen@softsky.com.ua>

ENV NODE_ENV	 production
ENV NODE_PORT	 3001

#RUN apt-get update && apt-get upgrade -y

COPY *.json /app/

#RUN cd /app \    
#    && npm install
# COPY copyables /
COPY *.js /app
ADD sslcert /app/sslcert
#COPY conf/*.js /app/conf/
COPY src /app/src
COPY model /app/model
COPY public /app/public
ADD node_modules /app/node_modules

EXPOSE ${NODE_PORT}

# Seems other forms of CMD does not accept ENV variable

CMD ["node", "/app/app.js"]
