FROM node:20-alpine
# No importa que no tengas una carpeta 'app' en tu PC, Docker la inventa.
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3010
# Asegúrate de que el archivo se llame server.js o app.js
CMD ["node", "server.js"]
