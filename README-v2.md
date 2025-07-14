# Recipe App API - Documentación de Endpoints

Esta documentación contiene todos los endpoints disponibles en la API del backend de la aplicación de recetas con ejemplos de curls.

## Configuración del Entorno

Antes de ejecutar la aplicación, asegúrate de tener configuradas las siguientes variables de entorno en tu archivo `.env`:

```bash
# Database Configuration
URI_BD=mongodb://localhost:27017/recipe-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-at-least-32-characters-long
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30

# Node Environment
NODE_ENV=development

# Server Configuration
PORT=3000
```

## Base URL

```
http://localhost:3000/api
```

## Autenticación

La mayoría de los endpoints requieren autenticación JWT. Include el token en el header `Authorization`:

```
Authorization: Bearer <tu-jwt-token>
```

## Sistema de Roles

La aplicación cuenta con un sistema de roles para controlar el acceso:

- **user**: Usuario normal (puede crear recetas, comentarios, etc.)
- **admin**: Administrador (puede aprobar recetas, moderar comentarios, gestionar usuarios)

---

## 🔐 Endpoints de Autenticación

### 1. Registrar Usuario

**POST** `/api/user/auth/register`

```bash
curl -X POST http://localhost:3000/api/user/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "fechaNacimiento": "1990-05-15",
    "nacionalidad": "Argentina",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### 2. Iniciar Sesión

**POST** `/api/user/auth/login`

```bash
curl -X POST http://localhost:3000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### 3. Renovar Token

**POST** `/api/user/auth/refresh-token`

```bash
curl -X POST http://localhost:3000/api/user/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "tu-refresh-token"
  }'
```

### 4. Olvidé mi Contraseña

**POST** `/api/user/auth/forgot-password`

```bash
curl -X POST http://localhost:3000/api/user/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com"
  }'
```

### 5. Restablecer Contraseña

**PATCH** `/api/user/auth/reset-password/:token`

```bash
curl -X PATCH http://localhost:3000/api/user/auth/reset-password/reset-token-aqui \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123",
    "passwordConfirm": "newpassword123"
  }'
```

---

## 👤 Endpoints de Usuario

### 6. Obtener Perfil del Usuario Actual

**GET** `/api/user/users/me`

```bash
curl -X GET http://localhost:3000/api/user/users/me \
  -H "Authorization: Bearer tu-jwt-token"
```

### 7. Actualizar Perfil

**PATCH** `/api/user/users/update-me`

```bash
curl -X PATCH http://localhost:3000/api/user/users/update-me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "name": "Juan Carlos",
    "apellido": "Pérez García",
    "email": "juan.carlos@example.com",
    "fechaNacimiento": "1990-05-15",
    "nacionalidad": "España"
  }'
```

### 8. Actualizar Avatar

**PATCH** `/api/user/users/update-avatar`

```bash
curl -X PATCH http://localhost:3000/api/user/users/update-avatar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  }'
```

### 9. Cambiar Contraseña

**PATCH** `/api/user/users/update-password`

```bash
curl -X PATCH http://localhost:3000/api/user/users/update-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "currentPassword": "password123",
    "password": "newpassword123",
    "passwordConfirm": "newpassword123"
  }'
```

### 10. Obtener Favoritos

**GET** `/api/user/users/me/favorites`

```bash
curl -X GET http://localhost:3000/api/user/users/me/favorites \
  -H "Authorization: Bearer tu-jwt-token"
```

### 11. Agregar a Favoritos

**POST** `/api/user/users/me/favorites/:recipeId`

```bash
curl -X POST http://localhost:3000/api/user/users/me/favorites/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

### 12. Remover de Favoritos

**DELETE** `/api/user/users/me/favorites/:recipeId`

```bash
curl -X DELETE http://localhost:3000/api/user/users/me/favorites/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

---

## 👨‍💼 Endpoints de Administración

### 13. Obtener Todos los Usuarios (Admin)

**GET** `/api/user/admin/users`

```bash
curl -X GET http://localhost:3000/api/user/admin/users \
  -H "Authorization: Bearer tu-jwt-token"
```

### 14. Obtener Usuario por ID (Admin)

**GET** `/api/user/admin/users/:id`

```bash
curl -X GET http://localhost:3000/api/user/admin/users/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

### 15. Actualizar Usuario (Admin)

**PATCH** `/api/user/admin/users/:id`

```bash
curl -X PATCH http://localhost:3000/api/user/admin/users/65a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "name": "Nuevo Nombre",
    "apellido": "Nuevo Apellido",
    "nacionalidad": "Colombia",
    "role": "admin"
  }'
```

### 16. Eliminar Usuario (Admin)

**DELETE** `/api/user/admin/users/:id`

```bash
curl -X DELETE http://localhost:3000/api/user/admin/users/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

---

## 🍽️ Endpoints de Recetas

### 17. Obtener Todas las Recetas

**GET** `/api/recipes/`

```bash
curl -X GET http://localhost:3000/api/recipes/ \
  -H "Authorization: Bearer tu-jwt-token"
```

### 18. Obtener Recetas Aprobadas

**GET** `/api/recipes/approved`

```bash
curl -X GET http://localhost:3000/api/recipes/approved \
  -H "Authorization: Bearer tu-jwt-token"
```

### 19. Obtener Recetas Pendientes (Admin)

**GET** `/api/recipes/pending`

```bash
curl -X GET http://localhost:3000/api/recipes/pending \
  -H "Authorization: Bearer tu-jwt-token"
```

### 20. Obtener Receta por ID

**GET** `/api/recipes/:id`

```bash
curl -X GET http://localhost:3000/api/recipes/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

### 21. Crear Nueva Receta

**POST** `/api/recipes/`

> **Nota**: El campo `autor` se agrega automáticamente desde el usuario autenticado.

```bash
curl -X POST http://localhost:3000/api/recipes/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "titulo": "Pasta Carbonara",
    "descripcion": "Deliciosa pasta italiana con huevos y panceta",
    "ingredientes": [
      {
        "ingrediente": "Pasta",
        "cantidad": 400,
        "unidadMedida": "g"
      },
      {
        "ingrediente": "Huevos",
        "cantidad": 3,
        "unidadMedida": "unidad"
      },
      {
        "ingrediente": "Panceta",
        "cantidad": 150,
        "unidadMedida": "g"
      }
    ],
    "tiempoCoccion": 25,
    "dificultad": "medio",
    "cantidadComensales": 4,
    "categoria": "almuerzo",
    "cocina": "Italiana",
    "tags": ["Rapido", "Internacional"],
    "imagen": "https://example.com/pasta-carbonara.jpg"
  }'
```

### 22. Actualizar Receta

**PUT** `/api/recipes/:id`

> **Nota**: Solo el autor de la receta o un admin puede actualizarla.

```bash
curl -X PUT http://localhost:3000/api/recipes/65a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "titulo": "Pasta Carbonara Mejorada",
    "descripcion": "Versión mejorada de la clásica pasta italiana",
    "cantidadComensales": 6,
    "tiempoCoccion": 30
  }'
```

### 23. Eliminar Receta

**DELETE** `/api/recipes/:id`

> **Nota**: Solo el autor de la receta o un admin puede eliminarla.

```bash
curl -X DELETE http://localhost:3000/api/recipes/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

### 24. Aprobar Receta (Admin)

**PATCH** `/api/recipes/:id/approve`

```bash
curl -X PATCH http://localhost:3000/api/recipes/65a1b2c3d4e5f6789012345/approve \
  -H "Authorization: Bearer tu-jwt-token"
```

### 25. Obtener Nombres de Recetas

**GET** `/api/recipes/names`

```bash
curl -X GET http://localhost:3000/api/recipes/names \
  -H "Authorization: Bearer tu-jwt-token"
```

### 26. Obtener Nombres de Ingredientes

**GET** `/api/recipes/ingredients/names`

```bash
curl -X GET http://localhost:3000/api/recipes/ingredients/names \
  -H "Authorization: Bearer tu-jwt-token"
```

### 27. Filtrar por Ingrediente

**GET** `/api/recipes/ingredient/:ingrediente`

```bash
curl -X GET http://localhost:3000/api/recipes/ingredient/Pasta \
  -H "Authorization: Bearer tu-jwt-token"
```

### 28. Filtrar por NO Ingrediente

**GET** `/api/recipes/not-ingredient/:ingrediente`

```bash
curl -X GET http://localhost:3000/api/recipes/not-ingredient/Gluten \
  -H "Authorization: Bearer tu-jwt-token"
```

### 29. Filtrar por Tags

**GET** `/api/recipes/tags/:tags`

```bash
curl -X GET http://localhost:3000/api/recipes/tags/Vegetariano,Rapido \
  -H "Authorization: Bearer tu-jwt-token"
```

### 30. Filtrar por Usuario

**GET** `/api/recipes/user/:usuarioId`

```bash
curl -X GET http://localhost:3000/api/recipes/user/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

---

## 📝 Endpoints de Pasos

### 31. Crear Paso

**POST** `/api/pasos/`

```bash
curl -X POST http://localhost:3000/api/pasos/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "texto": "Hervir agua con sal en una olla grande",
    "numeroDePaso": 1,
    "receta": "65a1b2c3d4e5f6789012345",
    "imagen": "https://example.com/paso1.jpg"
  }'
```

### 32. Obtener Pasos por Receta

**GET** `/api/pasos/receta/:recetaId`

```bash
curl -X GET http://localhost:3000/api/pasos/receta/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

---

## 💬 Endpoints de Comentarios

### 33. Crear Comentario

**POST** `/api/comentarios/`

> **Nota**: El campo `usuario` se agrega automáticamente desde el usuario autenticado.

```bash
curl -X POST http://localhost:3000/api/comentarios/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-jwt-token" \
  -d '{
    "texto": "¡Excelente receta! La probé y quedó deliciosa.",
    "valoracion": 5,
    "receta": "65a1b2c3d4e5f6789012345"
  }'
```

### 34. Obtener Comentarios Aprobados por Receta

**GET** `/api/comentarios/receta/:recetaId`

> **Nota**: Solo devuelve comentarios que han sido aprobados por un administrador.

```bash
curl -X GET http://localhost:3000/api/comentarios/receta/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

### 35. Obtener Comentarios Pendientes (Admin)

**GET** `/api/comentarios/pendientes`

> **Nota**: Solo administradores pueden ver comentarios pendientes de aprobación.

```bash
curl -X GET http://localhost:3000/api/comentarios/pendientes?page=1&limit=10 \
  -H "Authorization: Bearer tu-jwt-token"
```

### 36. Obtener Comentario por ID

**GET** `/api/comentarios/:id`

```bash
curl -X GET http://localhost:3000/api/comentarios/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

### 37. Aprobar Comentario (Admin)

**PATCH** `/api/comentarios/:id/aprobar`

> **Nota**: Solo administradores pueden aprobar comentarios.

```bash
curl -X PATCH http://localhost:3000/api/comentarios/65a1b2c3d4e5f6789012345/aprobar \
  -H "Authorization: Bearer tu-jwt-token"
```

### 38. Eliminar Comentario (Admin)

**DELETE** `/api/comentarios/:id`

> **Nota**: Solo administradores pueden eliminar comentarios.

```bash
curl -X DELETE http://localhost:3000/api/comentarios/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer tu-jwt-token"
```

---

## 📊 Respuestas de la API

### Formato de Respuesta Exitosa

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "recetas": [...]
  }
}
```

### Formato de Respuesta de Error

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

### Formato de Respuesta de Fallo

```json
{
  "status": "fail",
  "message": "Datos de entrada inválidos"
}
```

### Formato de Respuesta Paginada

```json
{
  "status": "success",
  "results": 10,
  "totalPages": 5,
  "currentPage": 1,
  "totalResults": 50,
  "data": {
    "comentarios": [...]
  }
}
```

---

## 👤 Esquema Completo de Usuario

Al registrar o actualizar un usuario, estos campos están disponibles:

```json
{
  "name": "String (requerido)",
  "apellido": "String (requerido)",
  "email": "String (requerido, único)",
  "fechaNacimiento": "Date (requerido, formato YYYY-MM-DD)",
  "nacionalidad": "String (requerido, 2-50 caracteres)",
  "password": "String (requerido, mínimo 8 caracteres)",
  "passwordConfirm": "String (requerido, debe coincidir con password)",
  "avatar": "String (opcional, base64)",
  "role": "String (user|admin, default: user)",
  "active": "Boolean (default: true)",
  "favorites": ["ObjectId ref to Recipe"],
  "createdAt": "Date (automático)",
  "updatedAt": "Date (automático)"
}
```

## 📋 Esquema Completo de Receta

Al crear o actualizar una receta, todos estos campos están disponibles:

```json
{
  "titulo": "String (requerido, 5-100 caracteres)",
  "descripcion": "String (requerido)",
  "ingredientes": [
    {
      "ingrediente": "String (requerido)",
      "cantidad": "Number (requerido)",
      "unidadMedida": "String (requerido) - ver unidades disponibles"
    }
  ],
  "tiempoCoccion": "Number (requerido, minutos)",
  "dificultad": "String (facil|medio|dificil, requerido)",
  "cantidadComensales": "Number (requerido, min: 1)",
  "categoria": "String (requerido) - ver categorías disponibles",
  "cocina": "String (requerido)",
  "tags": ["String - ver tags disponibles"],
  "imagen": "String (opcional, URL)",
  "autor": "ObjectId (automático - usuario autenticado)",
  "valoracionPromedio": "Number (automático, 0-5)",
  "cantidadValoraciones": "Number (automático)",
  "esPublica": "Boolean (default: false)",
  "aprobado": "Boolean (default: false)",
  "reportes": [
    {
      "usuario": "ObjectId ref to User",
      "razon": "String (requerido)",
      "comentario": "String (opcional)",
      "fechaCreacion": "Date (automático)"
    }
  ],
  "fechaCreacion": "Date (automático)",
  "fechaModificacion": "Date (automático)",
  "pasos": ["ObjectId ref to Paso"],
  "comentarios": ["ObjectId ref to Comentario"]
}
```

## 💬 Esquema Completo de Comentario

Al crear o gestionar comentarios, estos campos están disponibles:

```json
{
  "texto": "String (requerido, 5-500 caracteres)",
  "valoracion": "Number (requerido, 1-5, entero)",
  "usuario": "ObjectId ref to User (automático)",
  "receta": "ObjectId ref to Receta (requerido)",
  "fechaCreacion": "Date (automático)",
  "fechaModificacion": "Date (automático)",
  "aprobado": "Boolean (default: false)"
}
```

## 🏷️ Tags Disponibles para Recetas

- `Vegetariano`
- `Vegano`
- `SinGluten`
- `Dulce`
- `Salado`
- `Rapido`
- `Internacional`
- `Tradicional`
- `Saludable`
- `Economico`

## 📏 Unidades de Medida para Ingredientes

- `g` (gramos)
- `kg` (kilogramos)
- `ml` (mililitros)
- `l` (litros)
- `cdta` (cucharadita)
- `cda` (cucharada)
- `taza`
- `unidad`
- `pizca`

## 🍽️ Categorías de Recetas

- `desayuno`
- `almuerzo`
- `cena`
- `postre`
- `snack`
- `aperitivo`
- `bebida`
- `salsa`
- `sopa`
- `ensalada`
- `pan`
- `otro`

## 🎯 Niveles de Dificultad

- `facil`
- `medio`
- `dificil`

---

## ⚠️ Notas Importantes

1. **Autenticación**: La mayoría de endpoints requieren autenticación JWT.
2. **Autorización**: 
   - Solo el autor o admin puede actualizar/eliminar recetas
   - Solo admins pueden aprobar recetas y ver recetas pendientes
   - Solo admins pueden moderar comentarios (aprobar/eliminar)
   - Solo admins pueden ver comentarios pendientes
3. **Campos Automáticos**: 
   - El campo `autor` se agrega automáticamente desde el usuario autenticado
   - El campo `usuario` en comentarios se agrega automáticamente
4. **Validación**: Todos los endpoints validan los datos de entrada según el modelo.
5. **CORS**: La API está configurada para aceptar peticiones desde diferentes orígenes.
6. **Rate Limiting**: No implementado actualmente, pero recomendado para producción.
7. **Moderación**: Los comentarios requieren aprobación antes de ser visibles públicamente.
8. **Modelo Consolidado**: Se unificaron los modelos Recipe y Receta en un solo modelo Receta.

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar en modo desarrollo
npm start

# Ejecutar tests
npm test
```

## 📝 Estado de los Endpoints

✅ **Funcionando**: Todos los endpoints han sido revisados y corregidos.

Los principales cambios en la versión 2.2:
- **CONSOLIDACIÓN**: Unificación de modelos Recipe y Receta
- **COMENTARIOS**: Sistema completo de moderación de comentarios
- **ROLES**: Sistema de roles user/admin implementado
- **VALIDACIÓN**: Validaciones mejoradas y completas
- **CAMPOS NUEVOS**: Agregados campos como tiempoCoccion, dificultad, categoria, cocina
- **UNIDADES**: Actualización de unidades de medida más específicas
- **TAGS**: Ampliación de tags disponibles
- **ÍNDICES**: Optimización de base de datos con índices apropiados
- **MIDDLEWARE**: Middleware de autorización por roles
- **PAGINACIÓN**: Implementación de paginación en comentarios pendientes

Referencias inconsistentes corregidas:
- Modelo unificado de recetas (eliminado modelo duplicado)
- Middleware de autenticación mejorado con roles
- Servicios actualizados con campos correctos
- Rutas reorganizadas para evitar conflictos
- Formato de respuesta estandarizado
- Validaciones mejoradas y mensajes en español

---

**Versión**: 2.2
**Última actualización**: Diciembre 2024 