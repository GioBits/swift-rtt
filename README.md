# bug-busters

## Requisitos previos

- Docker = 24.x.x
- Docker Compose = 2.x.x
- Node.js = 20.x.x
- Python = 3.12.x

## Configuración inicial

Asegúrate de agregar un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias. Aquí tienes un ejemplo de cómo debería verse el archivo `.env`:

```properties
#FRONTEND
VITE_ENV= development
VITE_HOST=0.0.0.0
VITE_PORT=30
VITE_APP_API_URL= http://localhost:80

#BACKEND
API_ENV= development
API_HOST= 0.0.0.0
API_PORT= 80
CORS_ALLOWED_ORIGINS= http://localhost

# PostgreSQL
DB_NAME=db_name
DB_USER=admin
DB_PASS=pass
DB_HOST=db
DB_PORT=5432
```

## Levantar el ambiente completo con Docker Compose

Para levantar todos los servicios (frontend, backend y base de datos) con Docker Compose, ejecuta el siguiente comando en la raíz del proyecto:

```sh
docker-compose up --build
```

Esto levantará todos los servicios definidos en el archivo `docker-compose.yml`.

## Levantar servicios individuales con Docker Compose

### Levantar solo la base de datos

```sh
docker-compose up --build db
```

### Levantar solo el backend

```sh
docker-compose up --build backend
```

### Levantar solo el frontend

```sh
docker-compose up --build frontend
```

## Levantar el frontend sin Docker

Para levantar el frontend sin Docker, sigue estos pasos:

1. Navega al directorio del frontend:

   ```sh
   cd frontend
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Levanta el servidor de desarrollo:

   ```sh
   npm start
   ```

El frontend estará disponible en `http://localhost:3000`.

## Levantar el backend sin Docker

Para levantar el backend sin Docker, sigue estos pasos:

1. Navega al directorio del backend:

   ```sh
   cd backend
   ```

2. Crea un entorno virtual (opcional pero recomendado):

   ```sh
   python -m venv venv
   source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
   ```

3. Instala las dependencias:

   ```sh
   pip install -r requirements.txt
   ```

4. Levanta el servidor de desarrollo:

   ```sh
   python main.py
   ```

El backend estará disponible en `http://localhost:8000`.
La Documentacion del backend estará disponible en `http://localhost:8000/docs`.

## Estructura del proyecto

```
bug-busters/
│
├── backend/
│   ├── main.py               # Archivo principal donde se inicializa FastAPI
│   ├── models/               # Modelos de datos (Pydantic, ORM, etc.)
│   ├── api/                  # Rutas o endpoints o versiones del API
│   ├── db/                   # Base de datos (conexiones a la bd)
|   |── requirements.txt      # Dependencias del proyecto backend
├── frontend/                 # Código fuente del frontend
│   ├── public/               # Archivos públicos
│   ├── src/                  # Código fuente de la aplicación
│   ├── package.json          # Dependencias del proyecto frontend
│   └── ...                   # Otros archivos del frontend
├── docker-compose.yml        # Configuración de Docker Compose
└── .env                      # Archivo para variables de entorno
```
