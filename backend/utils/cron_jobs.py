import asyncio
import logging
import os
from models.process_media import StatusType
from api.service.processMediaService import ProcessMediaService
from ws.queueSetup import add_audio_task

# Configurar logger para este módulo
logger = logging.getLogger(__name__)

# Configuración del cron
CRON_ENABLED = os.getenv("CRON_ENABLED", "True").lower() in ["true", "1", "t", "y", "yes"]
CRON_FREQUENCY_SECONDS = int(os.getenv("CRON_FREQUENCY_SECONDS", 120))  # Por defecto, cada 2 minutos
PROCESS_BATCH_SIZE = int(os.getenv("PROCESS_BATCH_SIZE", 10))  # Número de tareas a procesar por ciclo

async def process_pending_tasks():
    """
    Procesa los scores.
    """
    logger.info("Procesando scores...")
    # AQUI VA LO DE SCORE

async def cron_task():
    """
    Tarea principal del cron que se ejecuta periódicamente.
    """
    try:
        logger.info("Ejecutando tarea cron...")
        
        # Procesar tareas pendientes
        await process_pending_tasks()
        
        logger.info("Tarea cron completada")
    except Exception as e:
        logger.error(f"Error en tarea cron: {str(e)}")

async def start_cron():
    """
    Inicia el cron si está habilitado.
    """
    if not CRON_ENABLED:
        logger.info("Cron deshabilitado por configuración")
        return
    
    logger.info(f"Iniciando cron con frecuencia de {CRON_FREQUENCY_SECONDS} segundos")
    
    while True:
        await cron_task()
        await asyncio.sleep(CRON_FREQUENCY_SECONDS)

def init_cron():
    """
    Inicializa el cron en el event loop actual.
    """
    if not CRON_ENABLED:
        logger.info("Cron deshabilitado por configuración")
        return
    
    logger.info("Inicializando cron...")
    
    # Obtener el event loop actual
    loop = asyncio.get_event_loop()
    
    # Crear y programar la tarea
    task = loop.create_task(start_cron())
    
    logger.info("Cron inicializado correctamente")
    
    return task 