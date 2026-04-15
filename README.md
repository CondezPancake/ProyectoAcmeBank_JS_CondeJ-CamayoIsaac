# 🏦 Proyecto AcmeBank — JavaScript

> Plataforma web bancaria de autogestión de cuentas para el **Banco Acme**, desarrollada con HTML, CSS y JavaScript puro, con persistencia en `localStorage`.

---

## 👨‍💻 Equipo de Desarrollo

| Rol | Nombre |
|-----|--------|
| 💻 Programador Front End | **Manuel Isaac Díaz** |
| 💻 Programador Front End | **Juan Pablo Conde** |

### 📊 Presentación del Proyecto
🔗 [Ver presentación en Gamma](https://gamma.app/docs/Proyecto-Acme-Bank-wp7krnp5afr22ll)

---

## 📋 Descripción General

AcmeBank es una aplicación web de banca digital que permite a los usuarios gestionar de forma autónoma sus cuentas bancarias desde el navegador. Incluye autenticación, registro, recuperación de contraseña, operaciones bancarias y generación de certificados, todo sin backend — los datos se almacenan en el navegador usando `localStorage` en formato JSON.

---

## 🚀 Instrucciones de Instalación y Ejecución

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge — versión reciente)
- Servidor local (recomendado para módulos ES6)

### Opción 1 — VS Code + Live Server *(recomendado)*
1. Clonar o descomprimir el repositorio.
2. Abrir la carpeta del proyecto en **Visual Studio Code**.
3. Instalar la extensión **Live Server** (si no la tiene).
4. Click derecho en `index.html` → **"Open with Live Server"**.
5. El proyecto se abrirá automáticamente en `http://127.0.0.1:5500`.

### Opción 2 — Python HTTP Server
```bash
# Navegar a la carpeta del proyecto
cd ProyectoAcmeBank_JS_CondeJ-CamayoIsaac

# Python 3
python -m http.server 5500

# Luego abrir: http://localhost:5500
```

### Opción 3 — Node.js con `serve`
```bash
npm install -g serve
serve .
```

> ⚠️ **Importante:** No abrir `index.html` directamente desde el explorador de archivos (protocolo `file://`), ya que los módulos ES6 (`type="module"`) requieren un servidor HTTP.

---

## 📁 Estructura del Proyecto

```
ProyectoAcmeBank_JS_CondeJ-CamayoIsaac/
│
├── index.html          # Página de inicio de sesión
├── register.html       # Formulario de registro
├── recovery.html       # Recuperación de contraseña
├── dashboard.html      # Panel principal del usuario
├── accounts.html       # Gestión de cuentas
├── settings.html       # Configuración del perfil
│
├── CSS/
│   ├── styles.css      # Estilos globales
│   ├── login.css       # Estilos de inicio de sesión
│   ├── register.css    # Estilos de registro
│   ├── recovery.css    # Estilos de recuperación
│   ├── dashboard.css   # Estilos del dashboard
│   ├── accounts.css    # Estilos de cuentas
│   ├── forms.css       # Estilos de formularios reutilizables
│   └── settings.css    # Estilos de ajustes
│
├── JS/
│   ├── auth/
│   │   ├── login.js    # Lógica de autenticación
│   │   ├── register.js # Lógica de registro de usuario
│   │   └── recovery.js # Lógica de recuperación de contraseña
│   │
│   ├── core/
│   │   ├── session.js  # Gestión de sesión activa
│   │   ├── storage.js  # Abstracción de localStorage
│   │   └── utils.js    # Funciones utilitarias generales
│   │
│   ├── dashboard/
│   │   ├── dashboard.js     # Inicialización y control del dashboard
│   │   ├── transactions.js  # Resumen de transacciones
│   │   ├── deposit.js       # Consignación electrónica
│   │   ├── withdraw.js      # Retiro de dinero
│   │   ├── services.js      # Pago de servicios públicos
│   │   ├── certificate.js   # Generación de certificado bancario (PDF)
│   │   ├── accounts.js      # Información de cuentas
│   │   └── settings.js      # Configuración de perfil desde el dashboard
│   │
│   └── ui/
│       └── alerts.js   # Sistema de alertas y notificaciones personalizadas
│
└── Data/
    └── Images/
        ├── logo.png
        └── logoAcme.webp
```

---

## ✅ Funcionalidades Completadas

### Autenticación
- [x] Inicio de sesión con tipo de documento, número de documento y contraseña
- [x] Validación de credenciales contra datos en `localStorage`
- [x] Redirección al Dashboard si las credenciales son correctas
- [x] Mensaje de error si las credenciales son incorrectas
- [x] Enlace a registro y a recuperación de contraseña

### Registro de Usuario
- [x] Formulario completo: tipo de doc, número de doc, nombres, apellidos, género, teléfono, correo, dirección, ciudad y contraseña
- [x] Validación de todos los campos en tiempo real
- [x] Asignación automática de número de cuenta bancaria
- [x] Asignación automática de fecha de creación de cuenta
- [x] Resumen de la transacción mostrando el número de cuenta asignado
- [x] Link para redirigir al inicio de sesión
- [x] Botón de cancelar (redirige al login)

### Recuperación de Contraseña
- [x] Formulario con tipo de doc, número de doc y correo electrónico
- [x] Validación de datos contra los almacenados
- [x] Ocultamiento del formulario de recuperación al validar
- [x] Formulario de asignación de nueva contraseña
- [x] Botón de cancelar (redirige al login)

### Dashboard — Inicio
- [x] Saludo personalizado al usuario
- [x] Resumen de cuenta (número de cuenta, saldo actual, fecha de creación)
- [x] Menú lateral de navegación funcional
- [x] Panel de notificaciones
- [x] Panel de perfil de usuario

### Dashboard — Resumen de Transacciones
- [x] Muestra las 10 últimas transacciones del usuario
- [x] Columnas: fecha, número de referencia, tipo, concepto/descripción y valor
- [x] Botón de impresión del resumen

### Dashboard — Consignación Electrónica
- [x] Muestra número de cuenta y nombre completo del usuario
- [x] Campo para ingresar monto a consignar
- [x] Genera registro con: fecha, referencia aleatoria, tipo "Consignación", concepto y valor
- [x] Aumenta el saldo de la cuenta
- [x] Resumen de transacción con botón de impresión

### Dashboard — Retiro de Dinero
- [x] Muestra número de cuenta y nombre completo del usuario
- [x] Campo para ingresar monto a retirar
- [x] Genera registro con: fecha, referencia aleatoria, tipo "Retiro", concepto y valor
- [x] Disminuye el saldo de la cuenta
- [x] Resumen de transacción con botón de impresión

### Dashboard — Pago de Servicios Públicos
- [x] Muestra número de cuenta y nombre del usuario
- [x] Selección del servicio (Energía, Agua, Gas Natural, Internet)
- [x] Campos de referencia y valor a pagar
- [x] Genera registro con: fecha, referencia aleatoria, tipo "Retiro", concepto "Pago de servicio público [Servicio]" y valor
- [x] Disminuye el saldo de la cuenta
- [x] Resumen de transacción con botón de impresión

### Dashboard — Certificado Bancario
- [x] Genera certificado indicando cuenta activa y fecha de creación
- [x] Opción de impresión/descarga en PDF (usando jsPDF)

### Dashboard — Cerrar Sesión
- [x] Elimina la sesión activa y redirige al login

### Diseño
- [x] Diseño responsive (mobile, tablet, desktop)
- [x] Paleta bancaria (azul profundo, blanco, grises)
- [x] Tipografía moderna (Inter via system-ui)
- [x] Mensajes de error y éxito con alertas animadas personalizadas
- [x] Validación de formularios en tiempo real

### Persistencia de Datos
- [x] Datos almacenados en `localStorage` en formato JSON
- [x] Estructuras de datos propias para usuarios, transacciones y sesión

---

## 🗄️ Estructuras de Datos (localStorage)

```json
// Clave: "usuarios" — Array de usuarios registrados
[
  {
    "tipoDoc": "cc",
    "numeroDoc": "1234567890",
    "nombres": "Carlos",
    "apellidos": "García",
    "genero": "masculino",
    "telefono": "3001234567",
    "correo": "carlos@email.com",
    "direccion": "Calle 10 #5-20",
    "ciudad": "Bucaramanga",
    "password": "Pass123!",
    "numeroCuenta": "ACM-4829173650",
    "fechaCreacion": "2026-04-14",
    "saldo": 500000,
    "transacciones": []
  }
]

// Clave: "sesionActiva" — Usuario logueado actualmente
{
  "tipoDoc": "cc",
  "numeroDoc": "1234567890"
}

// Estructura de transacción (dentro del array "transacciones" del usuario)
{
  "fecha": "2026-04-14T18:30:00",
  "referencia": "REF-748392",
  "tipo": "Consignación",
  "concepto": "Consignación por canal electrónico",
  "valor": 200000
}
```

---

## 🎯 Criterios de Evaluación

A continuación se resumen los criterios que evalúa el docente para este proyecto:

### 1. Documentación (README.md)
- Instrucciones claras para instalar y ejecutar el proyecto.
- Lista de funcionalidades completadas.

### 2. Código Fuente
- Código estructurado en carpetas claras y bien organizadas.
- Uso de buenas prácticas: nombres descriptivos y comentarios relevantes.
- Código funcional y probadamente ejecutable.
- Uso adecuado de buenas prácticas y Web Components.

### 3. Interfaz de Usuario
- Aplicación funcional con diseño responsivo (mobile, tablet, desktop).
- Todas las validaciones de formularios implementadas.
- Dashboard con diseño atractivo y menús funcionales.

### 4. Funcionalidades del Sistema
- Página de inicio de sesión funcional con redirección correcta.
- Formulario de registro con todos los campos y validaciones requeridas.
- Formulario de recuperación de contraseña operativo.
- Dashboard con: resumen de cuenta, transacciones, consignación, retiro, servicios públicos y certificado bancario.
- Persistencia de datos en el navegador con estructuras JSON diseñadas por el equipo.

### 5. Diseño
- Paleta de colores acorde a un banco (azul, blanco, gris).
- Tipografía clara y moderna.
- Mensajes de error y éxito visibles y bien diseñados.
- Compatibilidad responsive con todos los dispositivos.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|-----------|-----|
| HTML5 | Estructura de las páginas |
| CSS3 | Estilos, animaciones y diseño responsive |
| JavaScript (ES6+) | Lógica de la aplicación, módulos |
| localStorage | Persistencia de datos en el navegador |
| jsPDF | Generación de certificados en PDF |
| Google Fonts / system-ui | Tipografía |

---

## 📜 Licencia

Proyecto académico desarrollado para **Campuslands** — 2026.

---

<br><br><br>

---

<div align="center">

### 🎓 Créditos Especiales

<sub>
  
**Manuel Isaac Díaz** — Programador Front End 💻  
**Juan Pablo Conde** — Programador Front End 💻

</sub>

<br>

<sub>

...y en algún rincón oscuro del código, observando silenciosamente cada `console.log()`...

</sub>

<br>

<sub>

🕵️ **Cristian** *(Tutor)*  
`// TODO: agregar funcionalidad`  
`// FIXME: esto no debería estar acá`  
`// NOTE: el estudiante lo hizo bien... pero podría estar mejor`  
`// jk el código está perfecto, solo soy el fantasma del repositorio`

*— el hombre que vivía en el dashboard, pero como elemento oculto con `display: none`* 😂

</sub>

</div>
