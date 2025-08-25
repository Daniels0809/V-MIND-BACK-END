# Crisalida API Documentation

Documentación completa de la API REST para la plataforma de aprendizaje Crisalida.

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 📋 Endpoints

### 🔐 Autenticación

#### POST `/auth/register`
Registrar un nuevo usuario

**Body:**
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

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": "uuid-1234-5678",
      "user_name": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/auth/login`
Iniciar sesión

**Body:**
```json
{
  "email": "juan@example.com",
  "passwords": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": "uuid-1234-5678",
      "user_name": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "user",
      "current_level": 0,
      "objetive": "Aprender desarrollo web"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/auth/profile`
Obtener perfil del usuario (requiere token)

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid-1234-5678",
      "user_name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "3001234567",
      "rol": "user",
      "objetive": "Aprender desarrollo web",
      "current_level": 0,
      "preferred_language": "es",
      "creation_date": "2024-01-15T10:30:00.000Z",
      "last_connection": "2024-01-15T14:20:00.000Z"
    }
  }
}
```

#### PUT `/auth/profile`
Actualizar perfil del usuario (requiere token)

**Body:**
```json
{
  "user_name": "Juan Pérez Actualizado",
  "objetive": "Nuevo objetivo"
}
```

### 🗺️ Roadmaps

#### GET `/roadmaps`
Obtener todos los roadmaps

**Query Parameters:**
- `difficulty`: beginner, intermediate, advanced
- `topic`: filtro por tema

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "roadmap_id": 1,
      "title": "Roadmap de Desarrollo Web",
      "roadmap_description": "Ruta de aprendizaje para front-end y back-end",
      "topic": "Programación Web",
      "difficulty": "beginner",
      "estimated_time": 180,
      "creator_name": "Laura Gómez",
      "creation_date": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET `/roadmaps/:roadmapId`
Obtener un roadmap específico

#### POST `/roadmaps`
Crear un nuevo roadmap (requiere token)

**Body:**
```json
{
  "title": "Roadmap de React",
  "roadmap_description": "Aprende React desde cero",
  "topic": "Frontend",
  "difficulty": "beginner",
  "estimated_time": 120
}
```

#### PUT `/roadmaps/:roadmapId`
Actualizar un roadmap (requiere token)

#### DELETE `/roadmaps/:roadmapId`
Eliminar un roadmap (requiere token)

#### GET `/roadmaps/user/my-roadmaps`
Obtener roadmaps del usuario (requiere token)

### ✅ Tareas

#### GET `/tasks/level/:levelId`
Obtener tareas de un nivel específico

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "task_id": 1,
      "title": "Leer introducción a HTML",
      "description": "Material básico de etiquetas HTML",
      "type": "reading",
      "xp_reward": 50,
      "status": "pending",
      "level_title": "HTML & CSS Básico"
    }
  ]
}
```

#### GET `/tasks/user/my-tasks`
Obtener tareas del usuario (requiere token)

#### GET `/tasks/user/progress`
Obtener progreso de tareas del usuario (requiere token)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_tasks": 10,
    "completed_tasks": 5,
    "in_progress_tasks": 2,
    "pending_tasks": 3,
    "total_xp": 250,
    "completion_percentage": 50
  }
}
```

#### POST `/tasks/:taskId/assign`
Asignar tarea al usuario (requiere token)

#### PUT `/tasks/:userTaskId/complete`
Completar tarea (requiere token)

### 👤 Usuario

#### GET `/users/interests`
Obtener intereses del usuario (requiere token)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "interest_id": 1,
      "name": "Programación Web",
      "knowledge_level": "principiante"
    }
  ]
}
```

#### PUT `/users/interests`
Actualizar nivel de conocimiento de un interés (requiere token)

**Body:**
```json
{
  "interestId": 1,
  "knowledgeLevel": "intermedio"
}
```

#### GET `/users/notes`
Obtener notas del usuario (requiere token)

#### POST `/users/notes`
Crear nueva nota (requiere token)

**Body:**
```json
{
  "title": "Apuntes importantes",
  "content": "Contenido de la nota..."
}
```

#### PUT `/users/notes/:noteId`
Actualizar nota (requiere token)

#### DELETE `/users/notes/:noteId`
Eliminar nota (requiere token)

#### GET `/users/resources`
Obtener recursos guardados del usuario (requiere token)

#### POST `/users/resources`
Guardar nuevo recurso (requiere token)

**Body:**
```json
{
  "title": "Curso de React",
  "type": "video",
  "link": "https://youtube.com/curso-react",
  "duration_minutes": 45
}
```

#### GET `/users/stats`
Obtener estadísticas del usuario (requiere token)

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "current_level": 2,
      "creation_date": "2024-01-15T10:30:00.000Z",
      "last_connection": "2024-01-15T14:20:00.000Z"
    },
    "tasks": {
      "total": 15,
      "completed": 8,
      "total_xp": 400,
      "completion_percentage": 53
    },
    "streak": {
      "current": 5,
      "longest": 12
    },
    "achievements": {
      "triumphs": 3,
      "notes": 5,
      "resources": 8
    }
  }
}
```

### 🏥 Health Check

#### GET `/health`
Verificar el estado del servidor

**Response:**
```json
{
  "success": true,
  "message": "Crisalida API is running",
  "timestamp": "2024-01-15T14:20:00.000Z",
  "environment": "development"
}
```

## 📊 Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Ejemplos de Uso

### Ejemplo de Login y Uso de Token

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'laura@example.com',
    passwords: 'laura123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// 2. Usar token para obtener roadmaps
const roadmapsResponse = await fetch('http://localhost:3000/api/roadmaps', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const roadmapsData = await roadmapsResponse.json();
```

### Ejemplo de Crear Roadmap

```javascript
const newRoadmap = await fetch('http://localhost:3000/api/roadmaps', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Roadmap de Vue.js',
    roadmap_description: 'Aprende Vue.js desde cero',
    topic: 'Frontend',
    difficulty: 'beginner',
    estimated_time: 90
  })
});
```

## 🧪 Datos de Prueba

### Usuarios Disponibles:
- **Email:** `laura@example.com` / **Password:** `laura123` (Usuario normal)
- **Email:** `carlos@example.com` / **Password:** `carlos123` (Administrador)

### Roadmaps de Ejemplo:
- Roadmap de Desarrollo Web (beginner)
- Roadmap de Python (beginner)

### Tareas de Ejemplo:
- Leer introducción a HTML (reading)
- Practicar con CSS (practice)
- Hacer un quiz de JavaScript (quiz)
- Crear un proyecto React (project)

## 🚀 Configuración para Frontend

### CORS
La API está configurada para aceptar requests desde `http://localhost:3001`

### Rate Limiting
- 100 requests por IP cada 15 minutos

### Headers Recomendados
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // Para endpoints protegidos
};
```

## 📝 Notas Importantes

1. **Passwords vs Password**: El campo se llama `passwords` (plural) en la base de datos
2. **UUIDs**: Los IDs de usuario son UUIDs, no números enteros
3. **Timestamps**: Todas las fechas están en formato ISO 8601
4. **XP System**: Las tareas otorgan XP que se acumula para logros
5. **Roles**: Solo hay dos roles: `user` y `admin`

## 🔍 Debugging

Para debugging, puedes usar el endpoint de health check:
```bash
curl http://localhost:3000/health
```

Para ver logs del servidor, ejecuta:
```bash
npm run dev
```
