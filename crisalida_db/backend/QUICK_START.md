# 🚀 Crisalida Backend - Guía de Inicio Rápido

## 📋 Resumen del Proyecto

Has creado un backend completo para **Crisalida**, una plataforma de aprendizaje personalizada con:

- ✅ **Autenticación JWT** completa
- ✅ **Gestión de Roadmaps** (rutas de aprendizaje)
- ✅ **Sistema de Tareas** con XP y progreso
- ✅ **Gestión de Usuarios** con intereses y estadísticas
- ✅ **Notas y Recursos** personales
- ✅ **Base de datos MySQL** optimizada
- ✅ **API REST** documentada
- ✅ **Seguridad** implementada (Helmet, CORS, Rate Limiting)

## 🛠️ Configuración Inicial

### 1. Instalar Dependencias
```bash
cd backend
npm install
```

### 2. Configurar Base de Datos
```bash
# Crear la base de datos (si no existe)
mysql -u root -pQwe.123* < database/schema.sql

# Poblar con datos de prueba
npm run seed
```

### 3. Configurar Variables de Entorno
```bash
cp env.example .env
# Editar .env con tus credenciales
```

### 4. Ejecutar el Servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🧪 Probar la API

### Ejecutar Tests Automáticos
```bash
npm test
```

### Probar Manualmente
```bash
# Health check
curl http://localhost:3000/health

# Login con usuario de prueba
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"laura@example.com","passwords":"laura123"}'
```

## 📊 Datos de Prueba Disponibles

### Usuarios
- **Laura** (Usuario): `laura@example.com` / `laura123`
- **Carlos** (Admin): `carlos@example.com` / `carlos123`

### Roadmaps
- Roadmap de Desarrollo Web (beginner)
- Roadmap de Python (beginner)

### Tareas
- Leer introducción a HTML (reading)
- Practicar con CSS (practice)
- Hacer un quiz de JavaScript (quiz)
- Crear un proyecto React (project)

## 🔌 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrar usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `GET` | `/api/roadmaps` | Listar roadmaps |
| `POST` | `/api/roadmaps` | Crear roadmap |
| `GET` | `/api/tasks/level/:id` | Tareas de un nivel |
| `GET` | `/api/users/stats` | Estadísticas del usuario |
| `GET` | `/health` | Health check |

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración MySQL
├── controllers/
│   ├── authController.js    # Autenticación
│   ├── roadmapController.js # Roadmaps
│   ├── taskController.js    # Tareas
│   └── userController.js    # Usuarios
├── middleware/
│   └── auth.js             # JWT middleware
├── models/
│   ├── User.js             # Modelo usuario
│   ├── Roadmap.js          # Modelo roadmap
│   └── Task.js             # Modelo tareas
├── routes/
│   ├── auth.js             # Rutas auth
│   ├── roadmaps.js         # Rutas roadmaps
│   ├── tasks.js            # Rutas tareas
│   └── users.js            # Rutas usuarios
├── scripts/
│   └── seed.js             # Datos de prueba
├── database/
│   └── schema.sql          # Esquema BD
├── server.js               # Servidor principal
├── test-api.js             # Tests de la API
└── README.md               # Documentación completa
```

## 🎯 Características Implementadas

### 🔐 Autenticación
- Registro y login de usuarios
- JWT tokens seguros
- Middleware de autenticación
- Roles (admin/user)

### 🗺️ Roadmaps
- CRUD completo
- Filtros por dificultad y tema
- Gestión de niveles y tareas
- XP y recompensas

### ✅ Tareas
- Asignación de tareas a usuarios
- Seguimiento de progreso
- Diferentes tipos (reading, practice, quiz, project)
- Sistema de XP

### 👤 Usuario
- Gestión de intereses
- Notas personales
- Recursos guardados
- Estadísticas detalladas

### 🛡️ Seguridad
- Helmet para headers seguros
- Rate limiting
- CORS configurado
- Validación de datos

## 🚀 Próximos Pasos

### Para el Frontend
1. **Configurar CORS** para `http://localhost:3001`
2. **Usar JWT tokens** para autenticación
3. **Implementar endpoints** según la documentación
4. **Manejar errores** de la API

### Para el Backend
1. **Agregar validación** más robusta
2. **Implementar tests** unitarios
3. **Agregar logging** estructurado
4. **Configurar CI/CD**

## 📚 Documentación Completa

- **API Documentation**: `API_DOCUMENTATION.md`
- **README Principal**: `README.md`
- **Esquema de BD**: `database/schema.sql`

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Probar API
npm test

# Poblar BD
npm run seed

# Ver logs
tail -f logs/app.log
```

## 🆘 Solución de Problemas

### Error de Conexión a BD
```bash
# Verificar MySQL
sudo systemctl status mysql

# Verificar credenciales en .env
cat .env
```

### Puerto Ocupado
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso
lsof -ti:3000 | xargs kill -9
```

### Error de CORS
```bash
# Verificar configuración en server.js
# Asegurar que CORS_ORIGIN apunte al frontend
```

---

🎉 **¡Tu backend está listo para conectar con el frontend!**

La API proporciona toda la funcionalidad necesaria para una plataforma de aprendizaje completa con gamificación, roadmaps personalizados y seguimiento de progreso.
