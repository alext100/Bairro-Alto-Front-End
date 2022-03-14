# Sitio web y aplicación para la escuela de lengua portuguesa Bairro Alto.

_Proyecto en desarrollo_

### Tres roles de usuario:

#### **1. Administrador**


https://user-images.githubusercontent.com/83639312/158146256-81994984-9bc4-41c3-93da-d12cd809084a.mov


El administrador tiene acceso al CMS en el que puede editar el contenido de las páginas web, añadir noticias, artículos, imágenes, etc.

Las páginas web se editan en el WYSIWYG editor CKEditor 5.

#### **2. Profesor**



https://user-images.githubusercontent.com/83639312/158146298-51cd349a-2692-41aa-89e4-6ffb5c917544.mov



Desde el menú lateral, el profesor tiene acceso a las siguientes opciones:

    1. Mis grupos

    2. Crear un grupo

    3. Crear lección

    4. Chat

##### **1. Mis grupos**

El profesor tiene acceso a sus grupos y a todos los grupos de la escuela. Puede agregar o quitar cualquier grupo a su lista.

Entrando en uno de los grupos se pueden ver tabs:

- Los deberes

  Habiendo ingresado a uno de sus grupos, el profesor puede crear tareas para el grupo usando el WYSIWYG editor CKEditor 5. Puede agregar imágenes y archivos de audio(mp3, ogg, wav). Las imágenes en el servidor serán convertidas a formato .webp por el paquete sharp.

- Los alumnos

  Puede ver la lista de los estudiantes del grupo, eliminar a un estudiante del grupo.

- Agregar un alumno

  Puede agregar un estudiante al grupo, seleccionándolo de la lista de todos los usuarios en la tabla creada con _ag-grid-vue_. Donde puede utilizar la búsqueda por apellido, nombre o correo electrónico.

- Notas on-line

  Es la página para crear notas durante la clase online.

  - Puede ingresar la versión incorrecta de la palabra (frase) utilizada por el estudiante. (O puede ser una palabra (frase) nueva, p.e.)
  - Introduce la opción correcta.
  - Y marque _"Palabra nueva"_, _"Error"_, _"Pronunciación"_, _"Otro"_.

  Todas las notas se muestran en una tabla donde se pueden buscar, ordenar por tipo, nota, variante correcta o fecha.

- Lecciones del Grupo.

  El profesor puede ver la lista completa de lecciones en la tabla y agregar (eliminar) lecciones para este grupo. Esta tabla permite buscar y ordenar por Título de la lección, Autor, Nivel, Fecha de creación.

##### **2. Crear un grupo**

Input donde se puede ingresar el nombre del nuevo grupo

##### **3. Crear lección**

El profesor puede crear lecciones usando el WYSIWYG editor CKEditor 5. Puede agregar imágenes y archivos de audio(mp3, ogg, wav). Las imágenes en el servidor serán convertidas a formato .webp por el paquete _sharp_.

Es necesario asignar el nivel de la lección _A1_, _A2_, _B1_, _B2_

##### **4. Chat**

Chat similar a Telegram o WhatsApp.

- Es posible crear salas para la comunicación con los usuarios de la aplicación.
- Adjuntar archivos a los mensajes.
- Editar, eliminar mensajes.
- Reacciona con un emoji
- Grabar y enviar un mensaje de voz, etc.

Se utiliza el componente _vue-advanced-chat_.

_Cloud Firestore_ para guardar mensajes y usuarios.

_Realtime Database_ para comprobar si el usuario está on-line.

_Firebase storage_ para guardar los archivos

#### **3. Estudiante**



https://user-images.githubusercontent.com/83639312/158146336-c5c8fbf9-678b-458b-8d0e-360c8934dcd7.mov



El alumno desde el menú lateral tiene acceso a las siguientes opciones:

- Notas

  Una tabla con todas las notas que el profesor tomó durante las lecciones.
  Todas las notas se muestran en la tabla donde se pueden buscar, ordenar por nota, variante correcta o fecha.

- Lecciones.

  Todas las lecciones añadidas por el profesor al grupo al que pertenece este alumno.

- Chat

  El mismo chat que se describe en la sección Profesor. Para la comunicación con el grupo y profesor. O con cualquier usuario de la aplicación.

---

![project](https://storage.googleapis.com/bairro-alto.appspot.com/diagram-1647235556800.webp)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
