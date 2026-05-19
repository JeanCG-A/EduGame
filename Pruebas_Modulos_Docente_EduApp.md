# Pruebas de los Módulos del Docente — EduApp

---

## Módulo: Login Docente

### Pruebas unitarias

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-UNIT-001 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el controlador rechace peticiones sin email o sin contraseña |
| **Datos de entrada** | Petición POST a `/api/auth/login` con body `{ password: "123456" }` (sin email) |
| **Resultado esperado** | Respuesta con código 400 y mensaje `"Faltan correo o contraseña"` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del código de respuesta 400 en DevTools Network
- Captura del body de respuesta mostrando el mensaje de error
- Captura del código en `authController.js` línea 37-39 donde se hace la validación

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-UNIT-002 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio rechace credenciales inválidas (usuario no existe) |
| **Datos de entrada** | `{ email: "noexiste@test.com", password: "wrongpass" }` |
| **Resultado esperado** | El servicio lanza excepción con mensaje `"Credenciales inválidas"`. El controlador responde con código 401. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta 401 en DevTools Network
- Captura del mensaje de error en la interfaz de login
- Captura de la consulta `User.findOne` en los logs del backend

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-UNIT-003 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el token JWT generado contenga los datos correctos del usuario (id, role, name) |
| **Datos de entrada** | Login exitoso con email `docente@test.com` y password `password123` |
| **Resultado esperado** | Token JWT decodificado contiene `{ id, role: 'teacher', name }` con expiración de 24 horas |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del token en localStorage (Application/Storage)
- Captura del token decodificado desde consola del navegador
- Captura del payload del JWT mostrando los campos id, role y name

---

### Pruebas de integración de componentes

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-COMP-001 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el formulario de login en el frontend (React) envía las credenciales al backend correctamente, recibe el token y lo almacena (localStorage), y redirige al dashboard |
| **Datos de entrada** | En el frontend, escribir email `docente@colegio.com`, password `123456`, hacer clic en "Iniciar sesión" |
| **Resultado esperado** | En la pestaña Network se ve una petición POST a `/api/auth/login` con los datos. Respuesta 200 con token. El token se guarda en localStorage. El navegador redirige a `/dashboard`. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de login con datos diligenciados
- Captura de la pestaña Network mostrando la petición POST a `/api/auth/login`
- Captura de la respuesta 200 con el token JWT
- Captura del token guardado en localStorage (Application/Storage)
- Captura del dashboard del docente después de la redirección

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-COMP-002 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el interceptor de Axios inyecte el token JWT en todas las peticiones subsecuentes a endpoints protegidos |
| **Datos de entrada** | Login exitoso, luego petición GET a `/api/contenidos` |
| **Resultado esperado** | En el header de la petición GET se ve `Authorization: Bearer <token>`. El backend responde 200 con datos. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la pestaña Network mostrando el header `Authorization: Bearer eyJ...` en la petición GET
- Captura de la respuesta 200 con el listado de contenidos

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-COMP-003 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el middleware isTeacher rechace peticiones de estudiantes a rutas protegidas de escritura |
| **Datos de entrada** | Login como estudiante (role: student), intentar POST a `/api/contenidos` |
| **Resultado esperado** | Backend responde 403 Forbidden con mensaje `"Se requiere rol de profesor para esta acción."` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta 403 en DevTools Network
- Captura del body de respuesta con el mensaje de error
- Captura del código en `authMiddleware.js` donde se hace la validación de rol

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-COMP-004 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que los errores se propaguen correctamente desde la base de datos hasta la interfaz de usuario |
| **Datos de entrada** | Email no registrado: `"noexiste@test.com"`, contraseña: `"cualquiera"` |
| **Resultado esperado** | La interfaz muestra el mensaje `"Error al iniciar sesión. Verifica tus credenciales."`. No hay redirección. No hay token en localStorage. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con el mensaje de error visible en rojo
- Captura de la respuesta 401 en DevTools Network
- Captura de Application/Storage mostrando que NO hay token

---

### Pruebas de integración

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-INT-001 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar la integración entre AuthContext y ProtectedRoute para redirigir usuarios no autenticados |
| **Datos de entrada** | Sin token en localStorage, navegar directamente a `/dashboard` |
| **Resultado esperado** | ProtectedRoute detecta que no hay autenticación y redirige automáticamente a `/login` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la URL cambiando de `/dashboard` a `/login`
- Captura de Application/Storage mostrando que no hay token
- Captura del código de `ProtectedRoute.jsx` mostrando la redirección

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-INT-002 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que un estudiante autenticado sea redirigido al dashboard de estudiante y no al de docente |
| **Datos de entrada** | Login con credenciales de estudiante (role: student) |
| **Resultado esperado** | Después del login, el navegador redirige a `/student/dashboard`. El navbar muestra opciones de estudiante. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del dashboard de estudiante (`/student/dashboard`)
- Captura del navbar con opciones de estudiante
- Captura del token decodificado mostrando role: 'student'

---

### Pruebas funcionales

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-FUNC-001 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de inicio de sesión exitoso de un docente |
| **Datos de entrada** | Email: `docente@colegio.com`, Password: `123456` |
| **Resultado esperado** | El docente ingresa sus credenciales, el sistema valida, redirige a `/dashboard` con el navbar mostrando las opciones: Contenidos, Evaluaciones, Juegos, Registrar Estudiante |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de login diligenciado
- Captura de la respuesta 200 con token en Network
- Captura del dashboard del docente
- Captura del navbar con las opciones del docente

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-FUNC-002 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo de inicio de sesión fallido con credenciales incorrectas |
| **Datos de entrada** | Email: `docente@colegio.com`, Password: `contraseña_incorrecta` |
| **Resultado esperado** | El sistema muestra el mensaje de error en el formulario. No hay redirección. El usuario permanece en `/login`. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con los datos ingresados
- Captura del mensaje de error en rojo
- Captura de la respuesta 401 en Network

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-LOGIN-FUNC-003 |
| **Módulo** | Login docente |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar que el formulario no se envíe si los campos están vacíos (validación HTML5 required) |
| **Datos de entrada** | Campos email y password vacíos, hacer clic en "Iniciar sesión" |
| **Resultado esperado** | El navegador muestra el tooltip "Este campo es obligatorio" y no envía la petición |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del tooltip de validación HTML5 "Este campo es obligatorio"
- Captura de Network mostrando que NO hay peticiones POST

---

## Módulo: Registro del Docente

### Pruebas unitarias

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-UNIT-001 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el controlador rechace registros sin campos obligatorios |
| **Datos de entrada** | POST a `/api/auth/register` con `{ email: "test@test.com", password: "123456" }` (falta el nombre) |
| **Resultado esperado** | Respuesta 400 con mensaje `"Faltan campos obligatorios"` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta 400 en DevTools Network
- Captura del body con el mensaje de error
- Captura del código en `authController.js` línea 8 con la validación

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-UNIT-002 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que no se permitan registros con email duplicado |
| **Datos de entrada** | Email que ya existe en la tabla `users` |
| **Resultado esperado** | El servicio lanza excepción `"El correo ya está registrado"`. El controlador responde 400. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta 400 con mensaje "El correo ya está registrado"
- Captura de la interfaz mostrando el error
- Captura de la tabla `users` en MySQL mostrando que solo hay un registro con ese email

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-UNIT-003 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que la contraseña se almacene como hash bcrypt (no en texto plano) |
| **Datos de entrada** | `{ name: "Test", email: "test@test.com", password: "miClave123", role: "teacher" }` |
| **Resultado esperado** | En la base de datos, el campo `password` contiene un hash que comienza con `$2a$10$...` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la tabla `users` en MySQL mostrando el hash de la contraseña
- Captura del código en `authService.js` línea 17-18 con bcrypt.genSalt y bcrypt.hash

---

### Pruebas de integración de componentes

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-COMP-001 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el formulario de registro en el frontend envía los datos al backend, el servicio crea el usuario en MySQL con role='teacher' y redirige al login |
| **Datos de entrada** | En el frontend, escribir nombre "Profesor Nuevo", email "profesor.nuevo@eduapp.com", password "Segura123", confirmar password, hacer clic en "Crear Cuenta" |
| **Resultado esperado** | Petición POST a `/api/auth/register` con los datos. Respuesta 201. En MySQL aparece un nuevo registro en `users` con role='teacher'. Redirección a `/login`. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de registro diligenciado
- Captura de la respuesta 201 en DevTools Network
- Captura de la tabla `users` en MySQL mostrando el nuevo docente
- Captura de la redirección a `/login`
- Captura del login exitoso con las nuevas credenciales

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-COMP-002 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el sistema detecte email duplicado y muestre el error en la interfaz |
| **Datos de entrada** | Email ya existente en la base de datos |
| **Resultado esperado** | Respuesta 400 con mensaje "El correo ya está registrado". El mensaje se muestra en la interfaz. No se crea usuario duplicado. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con el mensaje de error visible
- Captura de la respuesta 400 en Network
- Captura de la tabla `users` en MySQL confirmando que no hay duplicados

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-COMP-003 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que si las contraseñas no coinciden, el error se muestra en el frontend sin llamar al backend |
| **Datos de entrada** | Escribir password "123456" y confirmar password "654321" |
| **Resultado esperado** | Aparece el mensaje "Las contraseñas no coinciden." En la pestaña Network NO aparece ninguna petición POST. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con el mensaje de error "Las contraseñas no coinciden."
- Captura de Network mostrando que NO hay peticiones al backend

---

### Pruebas de integración

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-INT-001 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar el ciclo completo: registro de docente → inicio de sesión con las mismas credenciales |
| **Datos de entrada** | Registrar docente con email "nuevo@eduapp.com", password "pass123". Luego iniciar sesión con esos mismos datos. |
| **Resultado esperado** | Registro exitoso (201). Login exitoso (200) con token JWT. El docente accede al dashboard. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del registro exitoso
- Captura del login exitoso con el mismo usuario
- Captura del dashboard del docente después del login

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-INT-002 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que la validación HTML5 minLength=6 funcione en el campo contraseña |
| **Datos de entrada** | Escribir contraseña "abc" (3 caracteres, menos de 6) |
| **Resultado esperado** | El navegador muestra el tooltip "Debe tener al menos 6 caracteres" y bloquea el envío |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del tooltip nativo del navegador "Debe tener al menos 6 caracteres"
- Captura de Network mostrando que NO hay peticiones

---

### Pruebas funcionales

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-FUNC-001 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de registro exitoso de un nuevo docente |
| **Datos de entrada** | nombre: "Docente Nuevo", email: "nuevodoce@test.com", password: "password123", confirmar password: "password123" |
| **Resultado esperado** | El formulario se envía, se recibe respuesta 201, el navegador redirige a `/login`, el docente puede iniciar sesión con sus credenciales |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario completamente diligenciado
- Captura de la respuesta 201 en Network
- Captura de la redirección a `/login`
- Captura del login exitoso con las nuevas credenciales

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-REG-FUNC-002 |
| **Módulo** | Registro del docente |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo de registro con contraseñas que no coinciden |
| **Datos de entrada** | password: "123456", confirmar password: "654321" |
| **Resultado esperado** | El sistema muestra el error "Las contraseñas no coinciden." sin enviar datos al backend |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con el error visible en pantalla
- Captura de Network mostrando que no hay peticiones POST

---

## Módulo: Contenido

### Pruebas unitarias

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-UNIT-001 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio cree un contenido en la base de datos con los datos proporcionados |
| **Datos de entrada** | `{ titulo: "Video sobre Fracciones", tipo: "video", contenido: "https://youtube.com/...", modulo: "Matemáticas", docente_id: 1 }` |
| **Resultado esperado** | El contenido se crea con todos los campos correctos y `publicado: false` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la tabla `contenidos` en MySQL mostrando el nuevo registro
- Captura del código en `content.service.js` método `crearContenido`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-UNIT-002 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el frontend valide campos obligatorios antes de enviar |
| **Datos de entrada** | Formulario con título vacío, tipo sin seleccionar, contenido vacío |
| **Resultado esperado** | Mensaje de error "Completa todos los campos obligatorios." Sin llamada a la API. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error en el formulario de creación
- Captura de Network mostrando que NO hay peticiones POST

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-UNIT-003 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que no se pueda modificar un contenido que ya está publicado |
| **Datos de entrada** | Contenido con `publicado: true`, intentar cambiar el título |
| **Resultado esperado** | El servicio lanza error: "No se puede modificar este contenido porque ya está publicado." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta de error al intentar editar contenido publicado
- Captura del código en `content.service.js` con la validación de `publicado`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-UNIT-004 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio permita editar un contenido en estado borrador |
| **Datos de entrada** | Contenido existente con `publicado: false`, enviar PUT a `/api/contenidos/:id` con nuevo título |
| **Resultado esperado** | El contenido se actualiza correctamente en la base de datos |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta 200 con el contenido actualizado
- Captura de la tabla `contenidos` en MySQL mostrando los cambios
- Captura del código en `content.service.js` método `editarContenido`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-UNIT-005 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio elimine un contenido en estado borrador |
| **Datos de entrada** | Contenido existente con `publicado: false`, enviar DELETE a `/api/contenidos/:id` |
| **Resultado esperado** | El contenido se elimina de la base de datos |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta 200 confirmando la eliminación
- Captura de la tabla `contenidos` en MySQL mostrando que el registro ya no existe
- Captura del código en `content.service.js` método `eliminarContenido`

---

### Pruebas de integración de componentes

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-COMP-001 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el formulario de creación en el frontend envía los datos al backend, pasa los middlewares de seguridad, crea el registro en MySQL y redirige a la lista |
| **Datos de entrada** | En el frontend, escribir título "Introducción a las Fracciones", tipo "video", URL "https://youtube.com/...", módulo "Matemáticas", hacer clic en "Crear contenido" |
| **Resultado esperado** | POST a `/api/contenidos` con JWT. Respuesta 201. En MySQL aparece el contenido con `publicado: false`. Redirección a `/contenidos`. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de creación diligenciado
- Captura de la respuesta 201 en Network
- Captura de la tabla `contenidos` en MySQL
- Captura de la lista de contenidos mostrando el nuevo registro

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-COMP-002 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que los middlewares verifyToken e isTeacher protejan el endpoint POST /api/contenidos |
| **Datos de entrada** | Escenario A: sin token. Escenario B: token de estudiante. Escenario C: token de docente. |
| **Resultado esperado** | A: 401 "Acceso denegado". B: 403 "Se requiere rol de profesor". C: 201 y contenido creado. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta 401 sin token
- Captura de la respuesta 403 con token de estudiante
- Captura de la respuesta 201 con token de docente

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-COMP-003 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que un estudiante no pueda acceder a la página de creación de contenido |
| **Datos de entrada** | Estudiante autenticado navega a `/crear-contenido` |
| **Resultado esperado** | El estudiante es redirigido a `/contenidos` o `/login` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la URL mostrando la redirección
- Captura del mensaje de error o pantalla resultante

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-COMP-004 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el docente pueda cambiar el estado de publicación de un contenido (publicar/despublicar) desde la lista de contenidos |
| **Datos de entrada** | En la lista de contenidos, hacer clic en el botón "Publicar" de un contenido en borrador, luego en "Despublicar" |
| **Resultado esperado** | El campo `publicado` cambia de `false` a `true` y viceversa en la BD. La interfaz refleja el cambio con etiqueta "Publicado"/"Borrador". |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del botón "Publicar" en la lista de contenidos
- Captura de la petición PUT con el cambio de estado
- Captura de la tabla `contenidos` mostrando el cambio de `publicado`
- Captura del contenido mostrando la etiqueta "Publicado"

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-COMP-005 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el docente pueda eliminar un contenido desde la interfaz con confirmación previa |
| **Datos de entrada** | En la lista de contenidos, hacer clic en "Eliminar", confirmar en el diálogo de confirmación |
| **Resultado esperado** | DELETE a `/api/contenidos/:id`. El contenido se elimina de BD. La lista ya no lo muestra. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del diálogo de confirmación "¿Estás seguro de eliminar este contenido?"
- Captura de la respuesta 200 de eliminación
- Captura de la lista de contenidos sin el elemento eliminado
- Captura de MySQL confirmando que el registro se eliminó

---

### Pruebas de integración

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-INT-001 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que los módulos creados se carguen desde la BD y se muestren en los selectores de evaluación y juego |
| **Datos de entrada** | Contenidos con módulos "Matemáticas", "Ciencias", "Historia" |
| **Resultado esperado** | El endpoint GET `/api/contenidos/modulos` devuelve los módulos. Los selectores en los formularios los muestran. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta de GET /api/contenidos/modulos en Network
- Captura del selector de módulos en el formulario de evaluación

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-INT-002 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar la regla de no editar contenido publicado desde el frontend |
| **Datos de entrada** | Contenido publicado, intentar editarlo desde `/contenidos/:id/editar` |
| **Resultado esperado** | El backend responde con error 400. El contenido no se modifica en BD. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error al intentar editar contenido publicado
- Captura de la tabla `contenidos` en MySQL mostrando que los datos no cambiaron

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-INT-003 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que los contenidos publicados sean visibles para los estudiantes y los no publicados no |
| **Datos de entrada** | Contenido A: publicado=true, Contenido B: publicado=false. Estudiante autenticado consulta GET `/api/contenidos`. |
| **Resultado esperado** | El estudiante solo ve el Contenido A. El Contenido B no aparece en la respuesta. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta GET `/api/contenidos` del estudiante mostrando solo contenidos publicados
- Captura del código en `content.service.js` con el filtro `where: { publicado: true }`

---

### Pruebas funcionales

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-FUNC-001 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de creación de contenido exitoso |
| **Datos de entrada** | titulo: "Mi primer contenido", tipo: "texto", contenido: "Texto educativo de prueba", modulo: "Pruebas" |
| **Resultado esperado** | Contenido creado exitosamente. Mensaje de éxito mostrado. Redirección a `/contenidos` donde el nuevo contenido aparece en la tabla. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario diligenciado
- Captura del mensaje "Contenido creado exitosamente."
- Captura de la lista de contenidos con el nuevo registro
- Captura de la tabla `contenidos` en MySQL

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-FUNC-002 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar que el formulario muestre error si faltan campos obligatorios |
| **Datos de entrada** | Solo diligenciar el título, dejar los demás campos vacíos |
| **Resultado esperado** | Mensaje "Completa todos los campos obligatorios." Sin llamada a la API. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error en el formulario
- Captura de Network mostrando que no hay peticiones

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-FUNC-003 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de edición de un contenido existente en estado borrador |
| **Datos de entrada** | Crear contenido "Matemáticas Básicas", luego editarlo: cambiar título a "Matemáticas Avanzadas", cambiar tipo a "PDF", hacer clic en "Guardar cambios" |
| **Resultado esperado** | Contenido actualizado exitosamente. Mensaje "Contenido actualizado exitosamente." Redirección a `/contenidos` con los datos modificados. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del formulario de edición con los datos originales precargados
- Captura del formulario con los datos modificados
- Captura del mensaje "Contenido actualizado exitosamente."
- Captura de la lista mostrando los datos actualizados
- Captura de la tabla `contenidos` en MySQL

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-CONT-FUNC-004 |
| **Módulo** | Contenido |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de eliminación de un contenido |
| **Datos de entrada** | Desde la lista de contenidos, hacer clic en "Eliminar" sobre un contenido en borrador, confirmar la eliminación en el diálogo |
| **Resultado esperado** | Contenido eliminado. Mensaje "Contenido eliminado exitosamente." Redirección a `/contenidos`. El contenido ya no aparece en la lista. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la lista de contenidos antes de eliminar
- Captura del diálogo de confirmación de eliminación
- Captura del mensaje "Contenido eliminado exitosamente."
- Captura de la lista sin el contenido eliminado

---

## Módulo: Evaluación

### Pruebas unitarias

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-UNIT-001 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que la validación del formulario detecte todos los campos faltantes |
| **Datos de entrada** | Evaluación sin título, una pregunta sin enunciado, opciones vacías |
| **Resultado esperado** | Error específico: "El título es obligatorio." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de validación "El título es obligatorio."
- Captura del código en `CrearEvaluacion.jsx` función `validarFormulario`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-UNIT-002 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que la transacción Sequelize ejecute rollback si falla la creación de preguntas |
| **Datos de entrada** | Evaluación con datos válidos, pregunta con enunciado vacío |
| **Resultado esperado** | Rollback ejecutado. No quedan registros huérfanos en BD. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del código en `evaluation.service.js` con la transacción y rollback
- Captura de MySQL mostrando que no hay registros huérfanos

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-UNIT-003 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que las opciones de las preguntas se mapeen correctamente del formato frontend al modelo de BD |
| **Datos de entrada** | `{ enunciado: "¿2+2?", opciones: {A:"1", B:"2", C:"3", D:"4"}, respuestaCorrecta: "B" }` |
| **Resultado esperado** | En BD: `opcion_a="1", opcion_b="2", opcion_c="3", opcion_d="4", respuesta_correcta="b"` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la tabla `preguntas` en MySQL mostrando los campos mapeados
- Captura del código de mapeo en `evaluation.service.js`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-UNIT-004 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio permita editar una evaluación en estado borrador |
| **Datos de entrada** | Evaluación existente con `publicado: false`, enviar PUT a `/api/evaluaciones/:id` con nuevo título y preguntas modificadas |
| **Resultado esperado** | La evaluación y sus preguntas se actualizan correctamente en la base de datos |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta 200 con la evaluación actualizada
- Captura de la tabla `evaluaciones` y `preguntas` en MySQL mostrando los cambios
- Captura del código en `evaluation.service.js` método `editarEvaluacion`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-UNIT-005 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio elimine una evaluación y todas sus preguntas asociadas |
| **Datos de entrada** | Evaluación existente con 3 preguntas, enviar DELETE a `/api/evaluaciones/:id` |
| **Resultado esperado** | La evaluación y todas sus preguntas se eliminan de la base de datos |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta 200 confirmando la eliminación
- Captura de las tablas `evaluaciones` y `preguntas` en MySQL mostrando que los registros ya no existen
- Captura del código en `evaluation.service.js` método `eliminarEvaluacion`

---

### Pruebas de integración de componentes

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-COMP-001 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el formulario de evaluación en el frontend envía los datos de la evaluación y sus preguntas al backend, que se usa una transacción para guardar ambos en MySQL y redirige a la lista |
| **Datos de entrada** | Título "Evaluación de Sumas", módulo "Matemáticas", tiempo limitado 10 min, 2 preguntas con sus opciones, hacer clic en "Crear Evaluación" |
| **Resultado esperado** | POST a `/api/evaluaciones`. Respuesta 201. 1 registro en `evaluaciones` y 2 en `preguntas`. Redirección a `/evaluaciones`. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con datos y preguntas diligenciadas
- Captura de la respuesta 201 en Network
- Captura de la tabla `evaluaciones` en MySQL
- Captura de la tabla `preguntas` en MySQL con las 2 preguntas creadas
- Captura de la lista de evaluaciones mostrando la nueva evaluación

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-COMP-002 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el selector de módulos se cargue desde la BD en el formulario de evaluación |
| **Datos de entrada** | Contenidos existentes con módulos "Matemáticas" y "Ciencias" |
| **Resultado esperado** | El dropdown de módulos muestra las opciones cargadas desde GET `/api/contenidos/modulos` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del dropdown de módulos mostrando las opciones
- Captura de la respuesta de GET /api/contenidos/modulos en Network

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-COMP-003 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el backend calcule correctamente el puntaje cuando un estudiante responde la evaluación |
| **Datos de entrada** | Evaluación con 2 preguntas. Estudiante responde: 1 correcta, 1 incorrecta. |
| **Resultado esperado** | Puntaje calculado: 50/100. Detalle por pregunta mostrando cuáles fueron correctas. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la interfaz del estudiante mostrando el resultado 50%
- Captura de la respuesta del backend con el detalle de calificación

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-COMP-004 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el docente pueda cambiar el estado de publicación de una evaluación (publicar/despublicar) |
| **Datos de entrada** | En la lista de evaluaciones, hacer clic en "Publicar" de una evaluación en borrador, luego en "Despublicar" |
| **Resultado esperado** | El campo `publicado` de la evaluación se actualiza. La interfaz muestra etiqueta "Publicado"/"Borrador". |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del botón "Publicar" en la lista de evaluaciones
- Captura de la petición PUT con el cambio de estado
- Captura de la tabla `evaluaciones` mostrando el cambio de `publicado`
- Captura de la evaluación mostrando la etiqueta "Publicado"

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-COMP-005 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el docente pueda eliminar una evaluación con confirmación, incluyendo todas sus preguntas |
| **Datos de entrada** | En la lista de evaluaciones, hacer clic en "Eliminar", confirmar en el diálogo |
| **Resultado esperado** | DELETE a `/api/evaluaciones/:id`. Evaluación y sus preguntas eliminadas de BD. La lista ya no la muestra. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del diálogo de confirmación de eliminación
- Captura de la respuesta 200 de eliminación
- Captura de la lista de evaluaciones sin el elemento eliminado
- Captura de MySQL mostrando que la evaluación y preguntas se eliminaron

---

### Pruebas de integración

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-INT-001 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que el mapeo de datos entre el frontend y el backend sea correcto para las preguntas |
| **Datos de entrada** | Pregunta con enunciado y 4 opciones, respuestaCorrecta: "B" |
| **Resultado esperado** | En BD el campo `respuesta_correcta` se guarda como "b" (minúscula) y las opciones en los campos respectivos |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la tabla `preguntas` en MySQL mostrando los datos mapeados correctamente

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-INT-002 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que al eliminar una pregunta del formulario dinámico, solo se envíen las preguntas restantes |
| **Datos de entrada** | Agregar 3 preguntas, eliminar la segunda, enviar el formulario |
| **Resultado esperado** | Solo se crean 2 preguntas en la BD (no se envía la eliminada) |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario mostrando 2 preguntas después de eliminar 1
- Captura de la tabla `preguntas` mostrando solo 2 registros

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-INT-003 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que los estudiantes solo vean las evaluaciones publicadas |
| **Datos de entrada** | Evaluación A: publicado=true, Evaluación B: publicado=false. Estudiante autenticado consulta GET `/api/evaluaciones`. |
| **Resultado esperado** | El estudiante solo ve la Evaluación A. La Evaluación B no aparece. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta GET `/api/evaluaciones` del estudiante mostrando solo evaluaciones publicadas
- Captura del código que filtra evaluaciones por `publicado: true` para estudiantes

---

### Pruebas funcionales

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-FUNC-001 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de creación de evaluación con 3 preguntas |
| **Datos de entrada** | Título: "Evaluación de Ciencias", módulo: "Ciencias", 3 preguntas con 4 opciones cada una, respuestas correctas marcadas |
| **Resultado esperado** | Evaluación creada. Mensaje de éxito. Redirección a `/evaluaciones`. En BD: 1 evaluación + 3 preguntas. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con 3 preguntas diligenciadas
- Captura del mensaje "Evaluación creada exitosamente."
- Captura de la lista de evaluaciones mostrando la nueva
- Captura de las tablas `evaluaciones` y `preguntas` en MySQL

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-FUNC-002 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar que no se pueda crear evaluación si una pregunta no tiene todas las 4 opciones |
| **Datos de entrada** | Pregunta con solo opciones A y B, opciones C y D vacías |
| **Resultado esperado** | Error "La pregunta 1 necesita todas las opciones (A, B, C, D)." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error en pantalla
- Captura del formulario mostrando las opciones incompletas

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-FUNC-003 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar la funcionalidad de tiempo limitado en la creación de evaluación |
| **Datos de entrada** | Activar checkbox "Evaluación con tiempo limitado", seleccionar 15 minutos |
| **Resultado esperado** | En BD: `tiempoLimitado = true`, `tiempoMinutos = 15` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con el checkbox activado y el selector de 15 minutos
- Captura de la tabla `evaluaciones` mostrando los campos de tiempo

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-FUNC-004 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de edición de una evaluación existente |
| **Datos de entrada** | Crear evaluación "Evaluación de Sumas", luego editarla: cambiar título a "Evaluación de Restas", agregar 1 pregunta nueva, modificar tiempo a 20 min, hacer clic en "Guardar cambios" |
| **Resultado esperado** | Evaluación actualizada. Mensaje "Evaluación actualizada exitosamente." Redirección a `/evaluaciones`. BD refleja cambios. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del formulario de edición con datos precargados
- Captura del formulario con los cambios realizados
- Captura del mensaje "Evaluación actualizada exitosamente."
- Captura de la lista de evaluaciones mostrando los datos actualizados
- Captura de las tablas `evaluaciones` y `preguntas` en MySQL

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EVAL-FUNC-005 |
| **Módulo** | Evaluación |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de eliminación de una evaluación |
| **Datos de entrada** | Desde la lista de evaluaciones, hacer clic en "Eliminar" sobre una evaluación, confirmar la eliminación |
| **Resultado esperado** | Evaluación eliminada. Mensaje "Evaluación eliminada exitosamente." Redirección a `/evaluaciones`. La evaluación ya no aparece. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la lista de evaluaciones antes de eliminar
- Captura del diálogo de confirmación de eliminación
- Captura del mensaje "Evaluación eliminada exitosamente."
- Captura de la lista sin la evaluación eliminada

---

## Módulo: Juego

### Pruebas unitarias

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-UNIT-001 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que la validación requiera seleccionar un tipo de juego |
| **Datos de entrada** | Formulario con título "Juego" pero tipo vacío |
| **Resultado esperado** | Error "El tipo de juego es obligatorio." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error "El tipo de juego es obligatorio."
- Captura del código de validación en `CrearJuegos.jsx`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-UNIT-002 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el generador de sopa de letras cree un tablero válido |
| **Datos de entrada** | Palabras: ["HOLA", "MUNDO"], tamaño: 10 |
| **Resultado esperado** | Grid de 10×10 con las palabras colocadas y letras aleatorias en el resto |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del tablero de sopa de letras generado en la interfaz
- Captura del código de `generarSopaDeLetras` en `DynamicGameForm.jsx`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-UNIT-003 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar la validación de palabras para sopa de letras (mínimo 2 palabras) |
| **Datos de entrada** | tipo: sopa_de_letras, config: 1 palabra vacía |
| **Resultado esperado** | Error "Debes agregar al menos 2 palabras." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error "Debes agregar al menos 2 palabras."

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-UNIT-004 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que la configuración JSON se parsee correctamente al leer desde la BD |
| **Datos de entrada** | Juego con `configuracion` como string JSON |
| **Resultado esperado** | `parseConfig` convierte el string a objeto JavaScript |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del código de `GameService.parseConfig`
- Captura de la respuesta de GET /api/juegos mostrando la config como objeto

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-UNIT-005 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio permita editar la configuración de un juego en estado borrador |
| **Datos de entrada** | Juego existente con `publicado: false`, enviar PUT a `/api/juegos/:id` con nueva configuración JSON |
| **Resultado esperado** | El juego se actualiza correctamente con la nueva configuración en la base de datos |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta 200 con el juego actualizado
- Captura de la tabla `juegos` en MySQL mostrando la configuración JSON modificada
- Captura del código en `game.service.js` método `editarJuego`

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-UNIT-006 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el servicio elimine un juego de la base de datos |
| **Datos de entrada** | Juego existente, enviar DELETE a `/api/juegos/:id` |
| **Resultado esperado** | El juego se elimina completamente de la base de datos |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta 200 confirmando la eliminación
- Captura de la tabla `juegos` en MySQL mostrando que el registro ya no existe
- Captura del código en `game.service.js` método `eliminarJuego`

---

### Pruebas de integración de componentes

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-COMP-001 |
| **Módulo** | Juego |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el formulario de creación de juego permita seleccionar tipo, configurar datos (sopa de letras), generar tablero automáticamente, mostrar vista previa, y guardar en MySQL |
| **Datos de entrada** | Título "Sopa de Letras - Animales", tipo "Sopa de Letras", 3 palabras (GATO, PERRO, ELEFANTE), generar tablero, hacer clic en "Guardar" |
| **Resultado esperado** | POST a `/api/juegos`. Respuesta 201. En MySQL el juego se guarda con configuración JSON. Redirección a `/juegos`. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario con las palabras ingresadas
- Captura del tablero generado automáticamente
- Captura de la vista previa en la columna derecha
- Captura de la respuesta 201 en Network
- Captura de la tabla `juegos` en MySQL mostrando la configuración JSON
- Captura de la lista de juegos con el nuevo juego

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-COMP-002 |
| **Módulo** | Juego |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el generador automático de crucigramas coloque palabras intersectadas |
| **Datos de entrada** | "CASA" (horizontal), "PERRO" (vertical), deben intersectar en la letra 'R' |
| **Resultado esperado** | El tablero se genera con ambas palabras intersectadas. La vista previa muestra pistas. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del tablero de crucigrama generado
- Captura de la vista previa mostrando las pistas

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-COMP-003 |
| **Módulo** | Juego |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que los 5 tipos de juego se almacenen correctamente con configuración JSON en BD |
| **Datos de entrada** | Crear 1 juego de cada tipo: sopa_de_letras, crucigrama, adivinanza, memoria, relacionar |
| **Resultado esperado** | 5 registros en `juegos` con configuraciones JSON válidas |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la tabla `juegos` en MySQL mostrando los 5 registros con sus configuraciones
- Captura de la lista de juegos mostrando los 5 tipos

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-COMP-004 |
| **Módulo** | Juego |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que la vista previa se actualice en tiempo real mientras se escribe la configuración |
| **Datos de entrada** | Escribir una adivinanza y completar las 3 opciones |
| **Resultado esperado** | La vista previa refleja los cambios instantáneamente, sin recargar la página |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la pantalla dividida mostrando formulario y vista previa
- Captura de la vista previa actualizada con los datos escritos

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-COMP-005 |
| **Módulo** | Juego |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el docente pueda cambiar el estado de publicación de un juego (publicar/despublicar) |
| **Datos de entrada** | En la lista de juegos, hacer clic en "Publicar" de un juego en borrador, luego en "Despublicar" |
| **Resultado esperado** | El campo `publicado` del juego se actualiza. La interfaz muestra etiqueta "Publicado"/"Borrador". |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del botón "Publicar" en la lista de juegos
- Captura de la petición PUT con el cambio de estado
- Captura de la tabla `juegos` mostrando el cambio de `publicado`
- Captura del juego mostrando la etiqueta "Publicado"

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-COMP-006 |
| **Módulo** | Juego |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el docente pueda eliminar un juego desde la interfaz con confirmación |
| **Datos de entrada** | En la lista de juegos, hacer clic en "Eliminar", confirmar en el diálogo de confirmación |
| **Resultado esperado** | DELETE a `/api/juegos/:id`. El juego se elimina de BD. La lista ya no lo muestra. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del diálogo de confirmación de eliminación
- Captura de la respuesta 200 de eliminación
- Captura de la lista de juegos sin el elemento eliminado
- Captura de MySQL confirmando que el registro se eliminó

---

### Pruebas de integración

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-INT-001 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que las validaciones específicas de cada tipo de juego eviten enviar datos incompletos al backend |
| **Datos de entrada** | Sopa de letras sin palabras, adivinanza sin opciones, memoria con menos de 2 pares |
| **Resultado esperado** | Cada tipo muestra su mensaje de error específico. No hay llamadas a la API. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del error para sopa de letras sin palabras
- Captura del error para adivinanza sin opciones
- Captura del error para memoria sin suficientes pares
- Captura de Network mostrando que no hay peticiones

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-INT-002 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que la validación de tablero generado funcione para sopa de letras |
| **Datos de entrada** | Ingresar palabras, NO hacer clic en "Generar Tablero", hacer clic en "Guardar" |
| **Resultado esperado** | Error "Debes generar el tablero con el botón 'Generar Tablero' antes de guardar." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error solicitando generar el tablero

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-INT-003 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que los estudiantes solo vean los juegos publicados |
| **Datos de entrada** | Juego A: publicado=true, Juego B: publicado=false. Estudiante autenticado consulta GET `/api/juegos`. |
| **Resultado esperado** | El estudiante solo ve el Juego A. El Juego B no aparece en la respuesta. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la respuesta GET `/api/juegos` del estudiante mostrando solo juegos publicados
- Captura del código que filtra juegos por `publicado: true` para estudiantes

---

### Pruebas funcionales

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-001 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de creación de un juego tipo adivinanza |
| **Datos de entrada** | Título "Adivinanza de Animales", módulo "Ciencias", tipo "Adivinanza", escribir acertijo "Tengo dientes...", 3 opciones, marcar respuesta correcta, hacer clic en "Guardar" |
| **Resultado esperado** | Juego creado exitosamente. Redirección a `/juegos`. En BD se guarda la configuración con adivinanza, opciones y respuesta correcta. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de adivinanza diligenciado
- Captura de la vista previa mostrando el acertijo
- Captura de la respuesta 201
- Captura de la lista de juegos mostrando el nuevo juego
- Captura de la tabla `juegos` con la configuración JSON

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-002 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de creación de un juego tipo memoria (Memotest) |
| **Datos de entrada** | Título "Memoria de Animales", tipo "Memotest", 2 pares de cartas (Gato-Cat, Perro-Dog), hacer clic en "Guardar" |
| **Resultado esperado** | Juego creado. Configuración JSON con pares guardados. Vista previa muestra las cartas. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de memoria con los pares diligenciados
- Captura de la vista previa mostrando las cartas
- Captura de la respuesta 201
- Captura de la lista de juegos

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-003 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar que no se pueda crear juego sin haber seleccionado un tipo |
| **Datos de entrada** | Título "Juego sin tipo", módulo "Pruebas", no seleccionar ningún tipo de juego |
| **Resultado esperado** | Error "El tipo de juego es obligatorio." No se envía la petición. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error "El tipo de juego es obligatorio."
- Captura del formulario sin tipo seleccionado

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-004 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de edición de un juego existente |
| **Datos de entrada** | Crear juego "Sopa de Animales", luego editarlo: cambiar título a "Sopa de Frutas", cambiar palabras, regenerar tablero, hacer clic en "Guardar cambios" |
| **Resultado esperado** | Juego actualizado. Mensaje "Juego actualizado exitosamente." Redirección a `/juegos`. BD refleja la nueva configuración. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura del formulario de edición con datos precargados
- Captura del formulario con los cambios realizados
- Captura de la vista previa actualizada
- Captura del mensaje "Juego actualizado exitosamente."
- Captura de la tabla `juegos` en MySQL con la configuración modificada

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-005 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de eliminación de un juego |
| **Datos de entrada** | Desde la lista de juegos, hacer clic en "Eliminar" sobre un juego, confirmar la eliminación |
| **Resultado esperado** | Juego eliminado. Mensaje "Juego eliminado exitosamente." Redirección a `/juegos`. El juego ya no aparece en la lista. |
| **Estado** | Pendiente |

**Capturas requeridas:**
- Captura de la lista de juegos antes de eliminar
- Captura del diálogo de confirmación de eliminación
- Captura del mensaje "Juego eliminado exitosamente."
- Captura de la lista sin el juego eliminado

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-006 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de creación de un juego tipo crucigrama |
| **Datos de entrada** | Título "Crucigrama de Animales", módulo "Ciencias", tipo "Crucigrama", escribir palabras: #1 PERRO (pista "Mejor amigo del hombre", Horizontal), #2 GATO (pista "Caza ratones", Vertical), #3 LEON (pista "Rey de la selva", Horizontal), hacer clic en "Generar Crucigrama Automáticamente", luego en "Guardar" |
| **Resultado esperado** | Juego creado exitosamente. Redirección a `/juegos`. Respuesta 201 con configuración JSON que incluye `tablero` (grid con las palabras intersectadas) y `pistas` (palabras colocadas con coordenadas). En BD la tabla `juegos` almacena la configuración completa del crucigrama. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de crucigrama con las 3 palabras diligenciadas
- Captura de la vista previa mostrando el tablero generado con las palabras intersectadas
- Captura de la respuesta 201 en DevTools Network
- Captura de la lista de juegos mostrando "Crucigrama de Animales"
- Captura de la tabla `juegos` con la configuración JSON (verificar campo `configuracion` con `tablero` y `pistas`)

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-007 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de creación de un juego tipo sopa de letras |
| **Datos de entrada** | Título "Sopa de Letras de Frutas", módulo "Ciencias", tipo "Sopa de Letras", escribir palabras: MANZANA (pista "Roja por fuera"), BANANA (pista "Amarilla y curva"), CEREZA (pista "Pequeña y roja"), DURAZNO (pista "Peludo por fuera"), FRESA (pista "Con semillas por fuera"), hacer clic en "Generar Tablero Automáticamente", luego en "Guardar" |
| **Resultado esperado** | Juego creado exitosamente. Redirección a `/juegos`. Respuesta 201 con configuración JSON que incluye `tablero`. En BD la tabla `juegos` almacena la sopa de letras completa. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de sopa de letras con las 5 palabras diligenciadas y tamaño 12×12
- Captura de la vista previa mostrando el tablero generado con las palabras ocultas
- Captura de la respuesta 201 en DevTools Network
- Captura de la lista de juegos mostrando "Sopa de Letras de Frutas"
- Captura de la tabla `juegos` con la configuración JSON (verificar `palabrasColocadas` y `tablero`)

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-JUEGO-FUNC-008 |
| **Módulo** | Juego |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de creación de un juego tipo relacionar palabras (asociación) |
| **Datos de entrada** | Título "Asociación de Animales", módulo "Idiomas", tipo "Relacionar Palabras", crear 4 pares: #1 (Gato, Cat), #2 (Perro, Dog), #3 (Pájaro, Bird), #4 (Pez, Fish), hacer clic en "Guardar" |
| **Resultado esperado** | Juego creado exitosamente. Redirección a `/juegos`. Respuesta 201 con configuración JSON que incluye `pares` con las 4 asociaciones correctas (columnaA ↔ columnaB). En BD la tabla `juegos` almacena los pares. Vista previa muestra columnas A y B con elementos mezclados. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de asociación con los 4 pares diligenciados
- Captura de la vista previa mostrando las dos columnas (A y B) con los elementos
- Captura de la respuesta 201 en DevTools Network
- Captura de la lista de juegos mostrando "Asociación de Animales"
- Captura de la tabla `juegos` con la configuración JSON (verificar array `pares` con `columnaA` y `columnaB`)

---

## Módulo: Registrar Estudiante

### Pruebas unitarias

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-UNIT-001 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el backend cree un usuario con rol 'student' |
| **Datos de entrada** | `{ name: "Estudiante Test", email: "est@test.com", password: "pass123", role: "student" }` |
| **Resultado esperado** | Usuario creado en BD con `role: 'student'` |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la tabla `users` en MySQL mostrando el registro con role='student'
- Captura de la respuesta 201 del backend

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-UNIT-002 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Prueba unitaria |
| **Descripción** | Verificar que el frontend bloquee el auto-registro si el estado es 'estudiante' |
| **Datos de entrada** | Estado de React con `role = 'estudiante'` |
| **Resultado esperado** | Mensaje de error "Acción denegada: Los estudiantes deben ser registrados por su docente." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error en pantalla
- Captura del código de validación en `RegisterEstudiante.jsx` línea 36-38

---

### Pruebas de integración de componentes

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-COMP-001 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el formulario de registro de estudiante (solo accesible por docentes) envía los datos, el backend crea el usuario con role='student' en MySQL y redirige al dashboard del ´/docente´ |
| **Datos de entrada** | En el frontend, escribir nombre "Juan Pérez", email "juan@padre.com", password "Estudiante2024", confirmar, hacer clic en "Crear estudiante" |
| **Resultado esperado** | POST a `/api/auth/register` con role='student'. Respuesta 201. En MySQL aparece un nuevo registro con role='student'. Redirección al dashboard del docente. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario de registro de estudiante diligenciado
- Captura de la respuesta 201 en Network
- Captura de la tabla `users` en MySQL mostrando el estudiante con role='student'
- Captura del dashboard del docente después de registrar

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-COMP-002 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que la ruta `/registroEstudiante` esté protegida y solo accesible por docentes autenticados |
| **Datos de entrada** | Escenario A: sin sesión. Escenario B: sesión de estudiante. Escenario C: sesión de docente. |
| **Resultado esperado** | A y B: redirección a `/login`. C: formulario visible con mensaje "Solo tu puedes registrar a tus estudiantes." |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la redirección a /login sin sesión
- Captura del formulario visible para el docente
- Captura del mensaje informativo "Solo tu puedes registrar a tus estudiantes."

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-COMP-003 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Integración de componentes |
| **Descripción** | Verificar que el estudiante registrado pueda iniciar sesión y acceder a su dashboard |
| **Datos de entrada** | Docente registra estudiante "María López" (maria@estudiante.com, maria2024). Luego iniciar sesión como María. |
| **Resultado esperado** | Login exitoso. Redirección a `/student/dashboard`. Navbar con opciones de estudiante. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del login del estudiante
- Captura del dashboard de estudiante (`/student/dashboard`)
- Captura del navbar mostrando opciones de estudiante

---

### Pruebas de integración

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-INT-001 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que el backend detecte email duplicado al registrar estudiante |
| **Datos de entrada** | Email de un estudiante que ya existe en la tabla `users` |
| **Resultado esperado** | Respuesta 400 con mensaje "El correo ya está registrado". No se crea duplicado. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura de la respuesta 400 con el mensaje de error
- Captura de la tabla `users` confirmando que no hay duplicados
- Captura del mensaje de error en la interfaz

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-INT-002 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Prueba de integración |
| **Descripción** | Verificar que la validación de contraseñas coincidentes funcione en el frontend |
| **Datos de entrada** | Password: "pass123", Confirmar: "pass456" |
| **Resultado esperado** | Error "Las contraseñas no coinciden." Sin llamada al backend. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del mensaje de error "Las contraseñas no coinciden."
- Captura de Network mostrando que no hay peticiones POST

---

### Pruebas funcionales

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-FUNC-001 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo completo de registro exitoso de un estudiante por parte del docente |
| **Datos de entrada** | Docente autenticado. nombre: "Carlos López", email: "carlos@tutor.com", password: "carlos2024", confirmar: "carlos2024" |
| **Resultado esperado** | Estudiante creado con role='student'. Docente redirigido a su dashboard. Estudiante puede iniciar sesión. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del formulario diligenciado
- Captura de la respuesta 201 en Network
- Captura de la tabla `users` con el nuevo estudiante
- Captura del dashboard del docente después del registro
- Captura del login exitoso del estudiante
- Captura del dashboard del estudiante

---

| Campo | Valor |
|-------|-------|
| **Identificador** | PRU-EST-FUNC-002 |
| **Módulo** | Registrar estudiante |
| **Tipo de prueba** | Prueba funcional |
| **Descripción** | Validar el flujo de registro de estudiante con contraseñas no coincidentes |
| **Datos de entrada** | password: "clave123", confirmar: "clave456" |
| **Resultado esperado** | Error "Las contraseñas no coinciden." No se envía la petición. |
| **Estado** | Cumple |

**Capturas requeridas:**
- Captura del error visible en pantalla
- Captura de Network mostrando que no hay peticiones

---

*Documento generado el 12 de mayo de 2026 — EduApp (React + Node.js/Express + MySQL)*
