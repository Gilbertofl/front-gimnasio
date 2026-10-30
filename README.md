# CycleFlow - Plataforma de Gestión para Estudio de Spinning

CycleFlow es una aplicación web moderna diseñada para la administración integral de un estudio de **Indoor Cycling (Spinning)**. Permite a los alumnos apartar sus clases y bicicletas en tiempo real, mientras que la secretaría o administración gestiona horarios, inventario de bicicletas, usuarios y vigencia de membresías.

---

## 🎯 ¿Qué hace el sistema?

La aplicación se divide en dos portales principales según el tipo de usuario:

### 1. Portal del Alumno (Cliente)
- **Carnet de Membresía Digital:** Muestra de forma clara si la membresía está activa y su fecha límite de vigencia.
- **Reserva de Clases:**
  - Elige el horario del turno en el que desea entrenar.
  - El sistema muestra únicamente las bicicletas que están libres en ese turno exacto.
  - Permite ingresar la talla de calzado para la bicicleta.
- **Gestión de Reservas:** Consulta sus clases activas con opción de modificarlas o cancelarlas si no puede asistir, además de ver su historial de clases concluidas.
- **Mi Perfil:** Consulta y actualización de datos personales (nombre, teléfono, correo o contraseña).

### 2. Portal de Administración (Secretaría / Administrador)
- **Control de Reservaciones:** Vista en vivo de todos los alumnos inscritos por horario. Permite concluir clases al terminar el turno (lo que libera la bicicleta automáticamente para el historial).
- **Catálogo de Bicicletas:** Alta de nuevas unidades, cambio de estado (libre, ocupada, en mantenimiento) y filtro para consultar disponibilidad en turnos específicos.
- **Horarios de Clases:** Programación y modificación de turnos diarios (ejemplo: 07:00, 08:00, 18:00 hrs).
- **Control de Membresías:** Activación y renovación de membresías asignadas a clientes por meses de duración, con detección automática de membresías vencidas.
- **Directorio de Usuarios:** Registro y edición de clientes y personal administrativo.

---

## 🚀 Tecnologías Utilizadas

- **React 18:** Construcción de la interfaz de usuario con componentes funcionales y Hooks.
- **React Router Dom (v6):** Manejo de rutas públicas y privadas protegidas por rol (`cliente` y `secretaria`).
- **Context API:** Manejo global de la sesión del usuario (`AuthContext`).
- **Diseño Personalizado:** Tema oscuro elegante con iconos vectoriales SVG limpios y maquetación centrada para cualquier tamaño de pantalla.

---

## 📂 Estructura del Proyecto

```text
src/
├── api/             # Conexión con los servicios del backend
│   ├── auth.js          # Inicio de sesión, registro y cierre
│   ├── bicicletas.js    # Control de bicicletas y disponibilidad
│   ├── config.js        # Configuración base de la API y manejo de errores
│   ├── horarios.js      # Turnos de clases
│   ├── membresias.js    # Control de suscripciones y vigencias
│   ├── reservaciones.js # Reservas de clases e historial
│   └── usuarios.js      # Directorio y perfiles
├── components/      # Componentes reutilizables
│   ├── Icons.js         # Colección de iconos vectoriales limpios
│   └── Navbar.js        # Barra de navegación adaptada por rol
├── context/         # Estado global y seguridad de rutas
│   ├── AuthContext.js   # Manejo de sesión y usuario activo
│   └── PrivateRoute.js  # Protección de rutas según el rol
└── pages/           # Vistas de la aplicación
    ├── LoginPage.js     # Inicio de sesión
    ├── RegisterPage.js  # Registro de nuevos usuarios
    ├── clientes/        # Vistas exclusivas para alumnos
    │   ├── ReservacionesClientePage.js
    │   └── WelcomePage.js
    └── secretaria/      # Vistas administrativas
        ├── BicicletasPage.js
        ├── HorariosPage.js
        ├── MembresiasPage.js
        ├── ReservacionesPage.js
        ├── UsuariosPage.js
        └── WelcomePage.js
```

---

## ⚙️ Pasos para Ejecutar el Proyecto

### Requisitos previos
- Node.js (versión 18 o superior recomendada)
- Backend de la aplicación ejecutándose en `http://localhost:5124`

### Instalación y arranque

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar la aplicación en modo desarrollo:**
   ```bash
   npm start
   ```
   La aplicación se abrirá automáticamente en tu navegador en `http://localhost:3000`.

3. **Generar versión de producción (opcional):**
   ```bash
   npm run build
   ```

---

## 🔑 Cuentas de Prueba

Para probar el flujo completo con datos ya cargados:

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Secretaría (Admin)** | `secretaria@gimnasio.com` | `Secretaria123!` |
| **Alumno (Cliente)** | `cliente@gimnasio.com` | `Cliente123!` |
