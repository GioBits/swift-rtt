import subprocess
import logging

# Configure logging to output to the console
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_for_changes():
    try:
        result = subprocess.run(
            ["alembic-autogen-check"],
            capture_output=True,
            text=True
        )
        if result.returncode == 1:
            logger.info("Changes detected in models.")
            return True
        elif result.returncode == 0:
            logger.info("No changes detected in models.")
            return False
        else:
            logger.error(f"Error checking for changes: {result.stderr}")
            raise Exception(result.stderr)
    except Exception as e:
        logger.error(f"Error checking for changes: {str(e)}")
        raise

def generate_migration():
    try:
        result = subprocess.run(
            ["alembic", "revision", "--autogenerate", "-m", "auto-generated"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            logger.info("Migration generated successfully.")
        else:
            logger.error(f"Error generating migration: {result.stderr}")
            raise Exception(result.stderr)
    except Exception as e:
        logger.error(f"Error generating migration: {str(e)}")
        raise

def apply_migrations():
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            logger.info("Migrations applied successfully.")
        else:
            logger.error(f"Error applying migrations: {result.stderr}")
            raise Exception(result.stderr)
    except Exception as e:
        logger.error(f"Error applying migrations: {str(e)}")
        raise

def run_migrations():
    # if check_for_changes():
    #     generate_migration()
    apply_migrations()