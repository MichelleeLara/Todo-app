# 📌 ToDo App

ToDo App es una aplicación de gestión de tareas que permite a los usuarios organizar su día a día con la funcionalidad de agregar, editar y eliminar tareas, subtareas y comentarios.

## 🚀 Tecnologías Utilizadas

- **Frontend:** Next.js, TypeScript, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB (con Mongoose)
- **Autenticación:** JWT (JSON Web Tokens)
- **Hosting Backend:** Render.com
- **Hosting Frontend:** Vercel

## ✨ Funcionalidades Principales

✅ **Autenticación de usuarios** (Registro, Login y Logout con JWT)
✅ **Gestión de tareas** (Crear, actualizar, eliminar)
✅ **Subtareas** (Añadir, editar y eliminar subtareas dentro de una tarea)
✅ **Comentarios** (Añadir, editar y eliminar comentarios en tareas)
✅ **Estado de tareas** (Pendiente o Completado)
✅ **Interfaz dinámica y animada** (Uso de Framer Motion)

---

## 📦 Instalación y Configuración

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### 🔧 Requisitos previos

Asegúrate de tener instalado:
- **Node.js** v16+ (https://nodejs.org/)
- **MongoDB** (Atlas o localmente)
- **Git**

### 📥 Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/todo-app.git
cd todo-app
```

### 📌 Configuración del Backend

1. **Instalar dependencias**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno**
   Crea un archivo `.env` en la carpeta **backend** con el siguiente contenido:
```env
MONGODB_URL=mongodb+srv://michia:H117z08qEy7qRXEq@todo.x9wsh.mongodb.net/?retryWrites=true&w=majority&appName=ToDo
PORT=8009
JWT_SECRET=K1JmZl8sKPl1WQm2BOpK1L7Gf8h5d3s9M1mV
CLIENT_URL=https://todo-app-henna-phi.vercel.app/
```

3. **Ejecutar el servidor**
```bash
npm run dev
```
El backend estará disponible en `http://localhost:5000`

### 🖥️ Configuración del Frontend

1. **Instalar dependencias**
```bash
cd frontend
npm install
```

2. **Configurar variables de entorno**
   Crea un archivo `.env.local` en la carpeta **frontend** con el siguiente contenido:
```env
NEXT_PUBLIC_API_URL=https://todo-app-cki7.onrender.com/api
```

3. **Ejecutar el frontend**
```bash
npm run dev
```
El frontend estará disponible en `http://localhost:3000`

---

## 🚀 Despliegue

### 🔹 Backend en Render
1. **Subir el código a GitHub**
2. **Crear un nuevo servicio en [Render](https://render.com)**
3. **Conectar el repositorio y configurar las variables de entorno**
4. **Seleccionar Node.js y desplegar**

### 🔹 Frontend en Vercel
1. **Subir el código del frontend a GitHub**
2. **Crear un nuevo proyecto en [Vercel](https://vercel.com/)**
3. **Conectar el repositorio y configurar las variables de entorno**
4. **Desplegar el proyecto**

---

## 🛠️ Posibles Errores y Soluciones

###  CORS Policy Issue
Si recibes un error relacionado con CORS en el frontend, asegúrate de que el backend tiene correctamente configurado CORS:
```js
import cors from 'cors';
app.use(cors({
    origin: ["https://todo-app-henna-phi.vercel.app", "http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```

###  Error 401 en tareas
Si el frontend no puede obtener las tareas, verifica que el token JWT se esté enviando correctamente:
```js
const token = localStorage.getItem("token");
fetch("https://todo-app-cki7.onrender.com/api/tasks", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
```
---

