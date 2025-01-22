from alembic import command
from alembic.config import Config
import logging

logger = logging.getLogger(__name__)

def run_migrations(db_url: str):
    try:
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("script_location", "migrations")
        alembic_cfg.set_main_option("sqlalchemy.url", db_url)
        
        command.revision(
            config=alembic_cfg,
            autogenerate=True,
            message="Auto-generated migration"
        )
        
        command.upgrade(alembic_cfg, "head")
        logger.info("Migraciones aplicadas exitosamente")
        
    except Exception as e:
        logger.error(f"Error en migraciones: {str(e)}")
        raise