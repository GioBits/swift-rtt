from sqlalchemy.orm import Session
from db.database import SessionLocal
from typing import Dict, Any
from models.providers import ProviderRecord, ProviderSchema, ProviderType

class ProviderService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def get_all_providers(self):
        """
        Retrieve all provider records from the database.

        This function creates a new database session, queries all records from the
        specified model table, converts them to the specified schema objects,
        and returns them as a list. The database session is closed after the operation.

        Returns:
            list: A list of schema objects representing all providers in the database.
        """
        try:
            providers = self.db.query(ProviderRecord).all()
            return [ProviderSchema.from_orm(provider) for provider in providers]
        except Exception as e:
            return str(e)

    def create_provider(self, data: Dict[str, Any]):
        """
        Create a new provider entry in the database.
        Args:
            data (dict): A dictionary containing the provider data.

        Returns:
            schema: The newly created provider object if successful.
            None: If the provider with the given name already exists.
        """
        try:
            # Check if the provider already exists in the database
            existing_provider = self.db.query(ProviderRecord).filter_by(name=data["name"]).first()
            if existing_provider:
                return None

            # Ensure the type is a valid ProviderType
            data["type"] = ProviderType[data["type"].upper()]

            new_provider = ProviderRecord(**data)
            self.db.add(new_provider)
            self.db.commit()
            self.db.refresh(new_provider)
            return ProviderSchema.from_orm(new_provider)
        except Exception as e:
            self.db.rollback()
            return str(e)