# 🚀 TigoAPI - Instrucciones para Revisión

## 📋 Información del Proyecto
- **Puerto**: 3000
- **Base de datos**: PostgreSQL (Supabase)
- **Documentación**: http://localhost:3000/api-docs

## 🔧 Cómo Ejecutar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

3. **Verificar que funciona:**
   ```bash
   curl http://localhost:3000/health
   ```

## 👤 Usuario Demo (Pre-creado)

**Para facilitar las pruebas, puede usar estas credenciales:**

### Registro (si quiere crear nuevo usuario):
```json
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "revisor",
  "email": "revisor@test.com", 
  "password": "password123"
}
```

### Login:
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

### 1. Autenticación
- ✅ Registrar usuario o usar credenciales demo
- ✅ Hacer login y obtener token JWT

### 2. Crear Mock
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

### 3. Crear Endpoint
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

### 4. Probar Mock
```
GET http://localhost:3000/mock/MOCK_ID_AQUI/users
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
El archivo `.env` está incluido para facilitar las pruebas (en producción se excluiría).

## 📝 Notas Técnicas
- **Framework**: Express.js 4.x
- **ORM**: Prisma
- **Base de datos**: PostgreSQL 
- **Autenticación**: JWT
- **Documentación**: Swagger
- **Seguridad**: Helmet, CORS
- **Validación**: express-validator

---
**Desarrollado por**: Mario Rocha
**Fecha**: Julio 2025
