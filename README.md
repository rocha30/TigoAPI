# 🚀 TigoAPI - Instrucciones para Revisión

## 📋 Información del Proyecto
- **Puerto**: 3000
- **Base de datos**: PostgreSQL (Docker) o Supabase (manual)
- **Documentación**: http://localhost:3000/api-docs

## 🔧 Cómo Ejecutar

### 🐳 **Opción 1: Con Docker (Recomendado)**

**Requisitos:** Solo Docker y Docker Compose

1. **Iniciar Docker:**
   ```bash
   # En macOS/Windows: Abrir Docker Desktop
   # En Linux: sudo systemctl start docker
   ```

2. **Clonar y ejecutar:**
   ```bash
   git clone <repo-url>
   cd TigoAPI
   docker-compose up --build
   ```

3. **Verificar que funciona:**
   ```bash
   curl http://localhost:3000/health
   ```

4. **Detener:**
   ```bash
   docker-compose down
   ```

> **Nota:** Si es la primera vez, Docker descargará las imágenes necesarias (puede tardar unos minutos).

### 💻 **Opción 2: Instalación Manual**

**Requisitos:** Node.js 18+, PostgreSQL

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar .env:**
   ```bash
   # Copiar las variables de entorno
   cp .env.example .env
   # Editar .env con tu DATABASE_URL
   ```

3. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate dev
   ```

4. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

5. **Verificar que funciona:**
   ```bash
   curl http://localhost:3000/health
   ```

## 👤 Crear Usuario para Pruebas

**Primero debe registrar un usuario para hacer las pruebas:**

### 1. Registro (crear nuevo usuario):
```json
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "revisor1",
  "email": "revisor1@test.com", 
  "password": "password1234"
}
```

### 2. Login (después del registro):
```json
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "revisor@test.com",
  "password": "password123"
}
```

## 🔑 JWT Token
- **Duración**: 30 días (suficiente para revisión)
- **Uso**: Agregar en headers como `Authorization: Bearer TOKEN_AQUI`

## 📁 Flujo de Prueba Recomendado

### 1. Registrar Usuario
- ✅ Crear usuario con POST `/api/auth/register`
- ✅ Usar las credenciales sugeridas arriba

### 2. Autenticación
- ✅ Hacer login con POST `/api/auth/login`
- ✅ Copiar el token JWT de la respuesta

### 3. Crear Mock
```json
POST http://localhost:3000/api/mocks
Authorization: Bearer TOKEN_AQUI
Content-Type: application/json

{
  "name": "API Demo",
  "description": "Mock para pruebas",
  "baseUrl": "https://api.example.com"
}
```

### 4. Crear Endpoint
```json
POST http://localhost:3000/api/endpoints/mock/MOCK_ID_AQUI
Authorization: Bearer TOKEN_AQUI
Content-Type: application/json

{
  "path": "/users",
  "method": "GET", 
  "statusCode": 200,
  "response": {
    "users": [
      {"id": 1, "name": "Juan"},
      {"id": 2, "name": "María"}
    ]
  }
}
```

### 5. Probar Mock
```
GET http://localhost:3000/mock/MOCK_ID_AQUI/users
```

## 📋 Respuestas Esperadas

### Registro exitoso:
```json
{
  "message": "User created successfully",
  "user": {
    "id": "abc123...",
    "email": "revisor@test.com",
    "username": "revisor",
    "createdAt": "2025-07-11T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login exitoso:
```json
{
  "message": "Login successful",
  "user": {
    "id": "abc123...",
    "username": "revisor",
    "email": "revisor@test.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Crear Mock exitoso:
```json
{
  "id": 1,
  "name": "API Demo",
  "description": "Mock para pruebas",
  "baseUrl": "https://api.example.com",
  "userId": 1,
  "createdAt": "2025-07-11T...",
  "updatedAt": "2025-07-11T..."
}
```

### Health Check:
```json
{
  "status": "OK",
  "timestamp": "2025-07-11T...",
  "environment": "development"
}
```

## 🌐 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login

### Gestión de Mocks  
- `GET /api/mocks` - Listar mocks
- `POST /api/mocks` - Crear mock
- `GET /api/mocks/:id` - Obtener mock
- `PUT /api/mocks/:id` - Actualizar mock
- `DELETE /api/mocks/:id` - Eliminar mock

### Gestión de Endpoints
- `GET /api/endpoints/mock/:mockId` - Listar endpoints
- `POST /api/endpoints/mock/:mockId` - Crear endpoint
- `GET /api/endpoints/:id` - Obtener endpoint
- `PUT /api/endpoints/:id` - Actualizar endpoint
- `DELETE /api/endpoints/:id` - Eliminar endpoint

### Ejecución de Mocks
- `ANY /mock/:mockId/*` - Ejecutar mock

### Utilidades
- `GET /health` - Health check
- `GET /api-docs` - Documentación Swagger

## 🔧 Variables de Entorno

### 🐳 **Para Docker (Automático)**
Docker Compose configura automáticamente:
- Base de datos PostgreSQL
- Variables de entorno
- Migraciones de Prisma
- Network interno

### 💻 **Para instalación manual**
El archivo `.env` está incluido para facilitar las pruebas (en producción se excluiría).

## 🐳 Comandos Docker Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Ejecutar comandos en el container
docker-compose exec app npx prisma studio

# Reiniciar solo la app
docker-compose restart app

# Limpiar todo
docker-compose down -v
```

## 📝 Notas Técnicas
- **Framework**: Express.js 4.x
- **ORM**: Prisma
- **Base de datos**: PostgreSQL 
- **Autenticación**: JWT
- **Documentación**: Swagger
- **Seguridad**: Helmet, CORS
- **Validación**: express-validator

## 📝 Notas para el Revisor

### JWT Configuration
- **Duración actual:** 30 días (configurable en `.env`)
- **Algoritmo:** HS256
- **Secret:** Configurado en `JWT_SECRET` del archivo `.env`

### Base de Datos
- **Tipo:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Migraciones:** Ejecutadas y sincronizadas

### Autenticación
- Todos los endpoints `/mocks/*` y `/endpoints/*` requieren autenticación
- El endpoint `/auth/login` genera el token JWT
- El endpoint `/auth/register` permite crear nuevos usuarios

### Cambiar duración del JWT
Si necesitas cambiar la duración del token, modifica en `.env`:
```
JWT_EXPIRES_IN=1h    # 1 hora
JWT_EXPIRES_IN=7d    # 7 días
JWT_EXPIRES_IN=30d   # 30 días (actual)
```

### Documentación API
- **Swagger UI:** http://localhost:3000/api-docs
- **Postman:** Importa los ejemplos de este README

### 📖 **¿Qué encontrarás en Swagger?**
- **Todos los endpoints** documentados interactivamente
- **Esquemas de request/response** con ejemplos
- **Autenticación JWT** configurada (botón "Authorize")
- **Probar endpoints** directamente desde el navegador
- **Descargar OpenAPI spec** para importar en otras herramientas

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar validación de entrada más robusta
- [ ] Implementar rate limiting
- [ ] Agregar logging más detallado
- [ ] Implementar tests unitarios
- [ ] Configurar CI/CD

## 🔧 Troubleshooting

### 🐳 **Problemas con Docker**

**Problema:** "Cannot connect to the Docker daemon"
**Solución:** Asegúrate de que Docker Desktop esté ejecutándose

**Problema:** "Port 3000 is already in use"
**Solución:** 
```bash
# Cambiar el puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

**Problema:** "Database connection failed"
**Solución:** 
```bash
# Reiniciar los servicios
docker-compose down
docker-compose up --build
```

### 💻 **Problemas Generales**

### Problema: "JWT expired"
**Solución:** El token tiene 30 días de duración. Si expira, simplemente haz login nuevamente.

### Problema: "User not found"
**Solución:** Usa las credenciales exactas: `revisor@test.com` / `password123`

### Problema: "Cannot access mock"
**Solución:** Verifica que estés usando el token en el header `Authorization: Bearer TOKEN_AQUI`

### Problema: Error de conexión a base de datos
**Solución:** 
- **Con Docker:** Reiniciar servicios con `docker-compose restart`
- **Sin Docker:** Verifica que el archivo `.env` tenga la `DATABASE_URL` correcta

### Problema: "Mock not found"
**Solución:** Primero crea un mock con POST `/mocks`, luego usa el ID devuelto en las siguientes peticiones.

## 📁 Estructura del Proyecto

```
/src
  /controllers
  /middlewares
  /models
  /routes
  /utils
```

---
**Desarrollado por**: Mario Rocha
**Fecha**: Julio 2025
