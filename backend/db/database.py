import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv(dotenv_path='../.env')

# Obtener las variables de entorno
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
ENVIRONMENT = os.getenv("ENVIRONMENT")

if not ENVIRONMENT:
    DB_HOST = "localhost"

# Crear la URL de la base de datos
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    # Crear el motor de la base de datos
    engine = create_engine(DATABASE_URL)
    # Probar la conexión
    with engine.connect() as connection:
        print("Conexión a la base de datos exitosa")
        print(DATABASE_URL)
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")
    sys.exit(1)

# Crear una base de datos declarativa para los modelos
Base = declarative_base()

# Crear la sesión de SQLAlchemy
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from models.audio import AudioRecord
from models.languages import LanguageRecord
from models.providers import TranscriptionProviderRecord, TranslationProviderRecord, TTSProviderRecord
from models.transcription_records import TranscriptionRecord
from models.translation_records import TranslationRecord
# from models.translated_audios import TranslatedAudio

# Crear las tablas en la base de datos (si no existen)
def init_db():
    Base.metadata.create_all(bind=engine)