# Usar Node.js LTS como base
FROM node:18-alpine

# Instalar herramientas necesarias
RUN apk add --no-cache openssl

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto de la aplicación
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
