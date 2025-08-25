# Crisalida Backend API

Backend API para la plataforma de aprendizaje Crisalida, desarrollada con Node.js, Express y MySQL.

## 🚀 Características

- **Autenticación JWT**: Sistema de login y registro seguro
- **Gestión de Roadmaps**: CRUD completo para rutas de aprendizaje
- **Gestión de Tareas**: Sistema de tareas y niveles
- **Base de Datos MySQL**: Conexión robusta con pool de conexiones
- **Seguridad**: Helmet, rate limiting, CORS configurado
- **Validación**: Middleware de autenticación y autorización

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=crisalida
   DB_PORT=3306

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=tu_jwt_secret_key_aqui
   JWT_EXPIRES_IN=24h

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3001
   ```

4. **Configurar la base de datos**
   - Asegúrate de que MySQL esté corriendo
   - Crea la base de datos `crisalida`
   - Ejecuta el script SQL proporcionado para crear las tablas

5. **Ejecutar el servidor**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev
   
   # Producción
   npm start
   ```

## 📚 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de base de datos
├── controllers/
│   ├── authController.js    # Controlador de autenticación
│   └── roadmapController.js # Controlador de roadmaps
├── middleware/
│   └── auth.js             # Middleware de autenticación
├── models/
│   ├── User.js             # Modelo de usuario
│   ├── Roadmap.js          # Modelo de roadmap
│   └── Task.js             # Modelo de tareas
├── routes/
│   ├── auth.js             # Rutas de autenticación
│   └── roadmaps.js         # Rutas de roadmaps
├── server.js               # Archivo principal del servidor
├── package.json
└── README.md
```

## 🔌 Endpoints de la API

### Autenticación

#### POST `/api/auth/register`
Registrar un nuevo usuario
```json
{
  "user_name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "3001234567",
  "passwords": "password123",
  "objetive": "Aprender desarrollo web",
  "preferred_language": "es"
}
```

#### POST `/api/auth/login`
Iniciar sesión
```json
{
  "email": "juan@example.com",
  "passwords": "password123"
}
```

#### GET `/api/auth/profile`
Obtener perfil del usuario (requiere token)
```
Authorization: Bearer <token>
```

#### PUT `/api/auth/profile`
Actualizar perfil del usuario (requiere token)
```json
{
  "user_name": "Juan Pérez Actualizado",
  "objetive": "Nuevo objetivo"
}
```

### Roadmaps

#### GET `/api/roadmaps`
Obtener todos los roadmaps
```
GET /api/roadmaps?difficulty=beginner&topic=web
```

#### GET `/api/roadmaps/:roadmapId`
Obtener un roadmap específico

#### POST `/api/roadmaps`
Crear un nuevo roadmap (requiere token)
```json
{
  "title": "Roadmap de React",
  "roadmap_description": "Aprende React desde cero",
  "topic": "Frontend",
  "difficulty": "beginner",
  "estimated_time": 120
}
```

#### PUT `/api/roadmaps/:roadmapId`
Actualizar un roadmap (requiere token)

#### DELETE `/api/roadmaps/:roadmapId`
Eliminar un roadmap (requiere token)

#### GET `/api/roadmaps/user/my-roadmaps`
Obtener roadmaps del usuario (requiere token)

### Health Check

#### GET `/health`
Verificar el estado del servidor

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 🗄️ Base de Datos

El proyecto utiliza MySQL con las siguientes tablas principales:

- `users`: Información de usuarios
- `roadmaps`: Rutas de aprendizaje
- `levels`: Niveles dentro de los roadmaps
- `tasks`: Tareas dentro de los niveles
- `user_tasks`: Progreso de usuarios en tareas
- `triumphs`: Logros y recompensas
- `streaks`: Racha de días activos
- `interests`: Intereses de los usuarios
- `notes`: Notas de los usuarios
- `resources`: Recursos guardados

## 🧪 Datos de Prueba

El script SQL incluye datos de ejemplo para probar la funcionalidad:

- Usuario: `laura@example.com` / `laura123`
- Roadmap de desarrollo web
- Tareas y niveles de ejemplo
- Logros y recursos de prueba

## 🚀 Scripts Disponibles

- `npm start`: Iniciar servidor en producción
- `npm run dev`: Iniciar servidor en desarrollo con nodemon
- `npm test`: Ejecutar tests (pendiente de implementar)

## 🔧 Configuración de Desarrollo

Para desarrollo local, asegúrate de:

1. Tener MySQL corriendo en `localhost:3306`
2. Crear la base de datos `crisalida`
3. Configurar las variables de entorno en `.env`
4. Ejecutar `npm run dev` para desarrollo

## 📝 Notas

- El servidor corre por defecto en el puerto 3000
- CORS está configurado para `http://localhost:3001` (frontend)
- Los logs incluyen información detallada para debugging
- Rate limiting está configurado para prevenir abuso

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
