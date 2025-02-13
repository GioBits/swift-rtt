from scripts.populate_languages import populate_languages
from scripts.populate_providers import populate_providers

def populate():
    print("Populating languages...")
    populate_languages()
    print("Languages populated successfully.")
    
    print("Populating providers...")
    populate_providers()
    print("Providers populated successfully.")

if __name__ == "__main__":
    main()