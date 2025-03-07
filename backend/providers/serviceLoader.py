import os
import logging
from providers.transcriberModule.transcriber import Transcriber
# from translate import Translate
# from text2speech import Text2Speech

# Configurar el sistema de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("ServiceLoader")

class ServiceLoader:
    def __init__(self):
        """
        Initialize the ServiceLoader and load all services if enabled by the environment variable.
        """
        # Leer la variable de entorno para determinar si los servicios deben cargarse
        self.services_enabled = os.getenv("ENABLE_RTT_SERVICES", "True").lower() == "true"

        # Inicializar servicios solo si el interruptor maestro está habilitado
        self.transcriber = None
        self.translate = None
        self.text2speech = None

        if self.services_enabled:
            logger.info("ServiceLoader: Loading all services...")
            self.transcriber = Transcriber()
            # self.translate = Translate()
            # self.text2speech = Text2Speech()
        else:
            logger.warning("ServiceLoader: Services are globally disabled.")

    def get_transcriber(self):
        """
        Get the Transcriber instance if services are enabled, otherwise log an error and return None.
        """
        if not self.services_enabled:
            logger.error("Attempted to access Transcriber service, but services are globally disabled.")
            return None
        return self.transcriber

    def get_translate(self):
        """
        Get the Translate instance if services are enabled, otherwise log an error and return None.
        """
        if not self.services_enabled:
            logger.error("Attempted to access Translate service, but services are globally disabled.")
            return None
        return self.translate

    def get_text2speech(self):
        """
        Get the Text2Speech instance if services are enabled, otherwise log an error and return None.
        """
        if not self.services_enabled:
            logger.error("Attempted to access Text2Speech service, but services are globally disabled.")
            return None
        return self.text2speech
    
ServiceLoader = ServiceLoader()