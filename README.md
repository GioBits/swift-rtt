# bug-busters

## Activar API Mock

En una nueva consola, correr el siguiente script:

```sh
npm start
```

## Contenedor Docker para el frontend

Ejecutar lo siguiente con la aplicacion de Docker abierta en segundo plano.

### Comando para generar contenedor Docker

```sh
docker build -t frontend .
```

### Ejecucion del contenedor Docker

```sh
docker run -d -p 80:80 frontend
```

### Verificar que el contenedor este en ejecucion

```sh
docker ps


bug-busters/
│
├── backend/
│   ├── main.py               # Archivo principal donde se inicializa FastAPI
│   ├── models/               # Modelos de datos (Pydantic, ORM, etc.)
│   ├── api/                  # Rutas o endpoints o versiones del API
│   ├── core/                 # Configuraciones y utilidades
│   ├── db/                   # Base de datos (modelos ORM, conexiones)
│   ├── tests/                # Pruebas unitarias
│   └── static/               # Archivos estáticos (si es necesario)
├── requeriments.txt          # Dependencias del proyecto
└── .env                      # Archivo para variables de entorno
```
