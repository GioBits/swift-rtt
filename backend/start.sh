#!/bin/sh

# Ejecutar migraciones
python -c "from utils.migrations import apply_migrations; apply_migrations()"
python -c "from scripts.populate import populate; populate()"

# Iniciar el servidor
gunicorn --bind ${API_HOST}:${API_PORT} -k uvicorn.workers.UvicornWorker main:app