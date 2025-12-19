from app import create_app
from extensions import db

# IMPORTANT: this import loads ALL models
import models

def bootstrap():
    app = create_app()

    with app.app_context():
        print("🚀 Creating tables in Railway PostgreSQL...")
        db.create_all()
        print("✅ All tables created successfully")

if __name__ == "__main__":
    bootstrap()
