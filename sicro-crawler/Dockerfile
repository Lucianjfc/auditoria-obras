ARG SQLSERVER_HOST
ARG SQLSERVER_USER
ARG SQLSERVER_PASSWORD
ARG SQLSERVER_DB
ARG RABBITMQ_HOST
ARG RABBITMQ_PORT
ARG RABBITMQ_USERNAME
ARG RABBITMQ_PASSWORD
ARG SQLSERVER_DRIVER

FROM python:3.8
# FROM tadeorubio/pyodbc-msodbcsql17:latest

ARG SQLSERVER_HOST
ARG SQLSERVER_USER
ARG SQLSERVER_PASSWORD
ARG SQLSERVER_DB
ARG RABBITMQ_HOST
ARG RABBITMQ_PORT
ARG RABBITMQ_USERNAME
ARG RABBITMQ_PASSWORD
ARG SQLSERVER_DRIVER

ENV SQLSERVER_HOST=${SQLSERVER_HOST}
ENV SQLSERVER_USER=${SQLSERVER_USER}
ENV SQLSERVER_PASSWORD=${SQLSERVER_PASSWORD}
ENV SQLSERVER_DB=${SQLSERVER_DB}
ENV RABBITMQ_HOST=${RABBITMQ_HOST}
ENV RABBITMQ_PORT=${RABBITMQ_PORT}
ENV RABBITMQ_USERNAME=${RABBITMQ_USERNAME}
ENV RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD}
# ENV SQLSERVER_DRIVER=${SQLSERVER_DRIVER}
ENV APP_ENV=prod

# install FreeTDS and dependencies
RUN apt-get update \
 && apt-get install unixodbc -y \
 && apt-get install unixodbc-dev -y \
 && apt-get install freetds-dev -y \
 && apt-get install freetds-bin -y \
 && apt-get install tdsodbc -y \
 && apt-get install --reinstall build-essential -y
# populate "ocbcinst.ini" as this is where ODBC driver config sits
RUN echo "[FreeTDS]\n\
Description = FreeTDS Driver\n\
Driver = /usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so\n\
Setup = /usr/lib/x86_64-linux-gnu/odbc/libtdsS.so" >> /etc/odbcinst.ini

# DEPENDECES FOR DOWNLOAD ODBC DRIVER
RUN apt-get install apt-transport-https 
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN apt-get update

# INSTALL ODBC DRIVER
RUN ACCEPT_EULA=Y apt-get install msodbcsql17 --assume-yes

# CONFIGURE ENV FOR /bin/bash TO USE MSODBCSQL17
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile 
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc 

COPY ./src .

COPY requirements.txt .

# CORRIGINDO ERRO PYODBC/MSSQL: ssl_choose_client_version:unsupported protocol
COPY openssl.cnf /etc/ssl/openssl.cnf

RUN pip install -r requirements.txt

RUN mkdir -p /opt/tce-ac/robos/crawler/pdf-files
RUN mkdir -p /opt/tce-ac/robos/crawler/json-files
RUN mkdir -p /opt/tce-ac/robos/crawler/json-list-files

ENV TZ=America/Recife
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["python", "-u", "./main.py"]