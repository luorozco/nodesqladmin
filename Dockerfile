# La imagen de la que se basará la nueva imagen generada
FROM node:10.16.0-jessie
# Nombre de la aplicación
LABEL appname="NodeSQLAdmin"
# El autor
LABEL author="Luis Orozco Arévalo"

# Installar las dependencias de Node y copiar los archivos
# Este comando creará una carpeta llamada node
RUN mkdir /node
# Y aquí le indicaremos que la carpeta de trabajo será la carpeta creada
WORKDIR /node
# En un principio simplemente copiaremos los archivos package.json para poder instalar las dependencias
COPY package.json package-lock.json ./
# Con npm instalamos las dependencias
RUN npm install
# Copiamos todos los archivos que se encuentran en el mismo directorio que Dockerfile dentro de la carpeta de trabajo Node
ADD . .
# Hacemos un ls para comprobar que se han copiado todos los archivos
RUN ls -la ./src/*

# Iniciar la aplicación y exponer el puerto
EXPOSE 8080
CMD ["npm", "start"]
