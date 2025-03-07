import os
import logging
from providers.transcribeModule.transcriber import Transcriber
from providers.translateModule.translate import Translate
from providers.text2speachModule.textToSpeach import Text2Speech

# Configure the logging system
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
        # Read the environment variable to determine if services should be loaded
        self.services_enabled = os.getenv("ENABLE_RTT_SERVICES", "True").lower() == "true"

        # Initialize services only if the master switch is enabled
        self.transcriber = None
        self.translator = None
        self.text2speech = None

        if self.services_enabled:
            logger.info("ServiceLoader: Loading all services...")
            self.transcriber = Transcriber()
            self.translator = Translate()
            self.text2speech = Text2Speech()
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

    def get_translator(self):
        """
        Get the Translate instance if services are enabled, otherwise log an error and return None.
        """
        if not self.services_enabled:
            logger.error("Attempted to access Translate service, but services are globally disabled.")
            return None
        return self.translator

    def get_text2speech(self):
        """
        Get the Text2Speech instance if services are enabled, otherwise log an error and return None.
        """
        if not self.services_enabled:
            logger.error("Attempted to access Text2Speech service, but services are globally disabled.")
            return None
        return self.text2speech
    
# Create a global instance of the ServiceLoader
ServiceLoader = ServiceLoader()