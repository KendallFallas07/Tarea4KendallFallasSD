# Tarea 4 - Sistemas Distribuidos

**Estudiante:** Kendall David Fallas Mena  
**Cédula:** 402630177  
**Curso:** Sistemas Distribuidos  
**Asignación:** Tarea 4  

## Sitio publicado

La aplicación se encuentra publicada en Netlify:

**https://tarea4kendallfallassd.netlify.app/**

## Descripción

Esta tarea implementa una aplicación distribuida para la administración de libros, autores y editoriales utilizando procesamiento diferido mediante RabbitMQ.

Las operaciones de creación, modificación y eliminación no actualizan directamente la base de datos. En su lugar, cada operación envía un mensaje a una cola de RabbitMQ llamada `bookstore`. Posteriormente, las funciones `bookTasks`, `authorTasks` y `publisherTasks` procesan los mensajes y ejecutan las funciones Batch correspondientes, que finalmente aplican los cambios en PostgreSQL.

## Tecnologías utilizadas

- Vue 3
- Vite
- Vue Router
- Node.js
- Netlify Functions
- RabbitMQ
- CloudAMQP
- PostgreSQL
- Neon
- GitHub
- Netlify

## Arquitectura general

```text
Frontend Vue
     |
     v
Netlify Functions
     |
     v
RabbitMQ / CloudAMQP
cola: bookstore
     |
     v
bookTasks / authorTasks / publisherTasks
     |
     v
Funciones Batch
     |
     v
PostgreSQL / Neon
```

## Funcionalidades implementadas

La aplicación permite administrar tres tipos de información:

- Libros
- Autores
- Editoriales

Para cada entidad se implementaron las operaciones de:

- Listar registros.
- Consultar un registro.
- Crear registros.
- Modificar registros.
- Eliminar registros.
- Sincronizar manualmente los cambios pendientes con la base de datos.

## Procesamiento diferido

Las operaciones de escritura siguen el siguiente flujo:

```text
Frontend
   |
   v
Insert / Update / Delete
   |
   v
RabbitMQ - bookstore
   |
   v
Cambio pendiente
   |
   v
Botón "Sincronizar cambios"
   |
   v
*Tasks
   |
   v
*Batch
   |
   v
PostgreSQL
```

Esto permite comprobar que los cambios no se reflejan inmediatamente en la base de datos, sino hasta que se procesa el mensaje pendiente.

## Books

Funciones principales:

```text
bookFindAll
bookFind
bookInsert
bookUpdate
bookDelete
bookTasks
bookInsertBatch
bookUpdateBatch
bookDeleteBatch
```

Flujo:

```text
bookInsert / bookUpdate / bookDelete
              |
              v
        RabbitMQ
        bookstore
              |
              v
          bookTasks
              |
              v
          Book Batch
              |
              v
        PostgreSQL
```

## Authors

Funciones principales:

```text
authorFindAll
authorFind
authorInsert
authorUpdate
authorDelete
authorTasks
authorInsertBatch
authorUpdateBatch
authorDeleteBatch
```

Las operaciones de creación, modificación y eliminación se procesan de manera diferida mediante RabbitMQ.

## Publishers

Funciones principales:

```text
publisherFindAll
publisherFind
publisherInsert
publisherUpdate
publisherDelete
publisherTasks
publisherInsertBatch
publisherUpdateBatch
publisherDeleteBatch
```

Las operaciones también utilizan la cola `bookstore` y se aplican a la base de datos mediante las funciones Batch.

## RabbitMQ y CloudAMQP

Se creó una instancia propia en CloudAMQP y una cola llamada:

```text
bookstore
```

Los mensajes generados por las operaciones de libros, autores y editoriales son enviados a esta cola.

Cada mensaje contiene la información necesaria para determinar:

- La entidad que generó el mensaje.
- El tipo de operación.
- El identificador del registro cuando corresponde.
- Los datos necesarios para insertar o modificar.

Ejemplo conceptual:

```json
{
  "entity": "book",
  "method": "UPDATE",
  "id": 1,
  "body": {
    "title": "Ejemplo"
  }
}
```

## Base de datos

La persistencia se realizó utilizando PostgreSQL mediante Neon.

Se utilizaron las tablas:

```text
books
authors
publishers
```

Las operaciones de escritura sobre SQL se realizan desde las funciones Batch.

## Publicación

El proyecto fue publicado utilizando GitHub y Netlify.

### Frontend

El frontend fue desarrollado con Vue 3 y Vite.

Netlify ejecuta:

```bash
npm run build
```

Vite genera la carpeta:

```text
dist/
```

Esta carpeta contiene el sitio estático publicado.

### Backend

Las funciones backend se encuentran en:

```text
netlify/functions/
```

Netlify publica estas funciones como funciones serverless.

Ejemplo:

```text
/.netlify/functions/bookFindAll
/.netlify/functions/bookInsert
/.netlify/functions/bookTasks
```

### Servicios externos

La aplicación publicada se conecta con:

```text
CloudAMQP -> RabbitMQ
Neon      -> PostgreSQL
```

Las credenciales y direcciones de conexión se administran mediante variables de entorno y no se almacenan directamente en el código fuente.

Variables utilizadas:

```text
DATABASE_URL
CLOUDAMQP_URL
API_BASE_URL
```

## Prueba del flujo

Para comprobar el procesamiento diferido se puede realizar el siguiente procedimiento:

1. Abrir la aplicación publicada.
2. Modificar un libro desde el frontend.
3. Confirmar que el frontend indica que existe un cambio pendiente.
4. Abrir Rabbit Manager en CloudAMQP.
5. Confirmar que el mensaje se encuentra en la cola `bookstore`.
6. Verificar que la base de datos todavía conserva el valor anterior.
7. Regresar al frontend.
8. Presionar **Sincronizar cambios**.
9. La función `bookTasks` procesa el mensaje.
10. La función Batch correspondiente aplica el cambio en PostgreSQL.
11. La interfaz actualiza la lista y muestra que la sincronización fue completada.

El mismo patrón se utiliza para autores y editoriales.

## Ejecución local

Instalar dependencias:

```bash
npm install
```

Ejecutar mediante Netlify Dev:

```bash
npm run netlify
```

La aplicación local queda disponible normalmente en:

```text
http://localhost:8888
```

Compilar para producción:

```bash
npm run build
```

## Seguridad

El archivo `.env` no debe publicarse ni agregarse al repositorio.

También se excluyen archivos y carpetas como:

```text
.env
node_modules/
dist/
.netlify/
```

## Autor

**Kendall David Fallas Mena**  
**Cédula: 402630177**  
**Curso: Sistemas Distribuidos**  
**Tarea 4**
