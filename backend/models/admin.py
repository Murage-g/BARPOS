from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_bcrypt import Bcrypt

# ---------------- CONFIG ----------------
DATABASE_URL = "postgresql://postgres:PmkNlDHVzJRDJBHuhdfHOChhlgqdYIVK@yamanote.proxy.rlwy.net:31828/railway"

Base = declarative_base()
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
bcrypt = Bcrypt()

# ---------------- USER MODEL ----------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(120), unique=True, nullable=False)
    email = Column(String(600), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
    role = Column(String(50), nullable=False, default="cashier")

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

# ---------------- CREATE ADMIN ----------------
def create_admin():
    Base.metadata.create_all(engine)
    session = Session()

    admin_email = "admin@example.com"
    existing_admin = session.query(User).filter_by(email=admin_email).first()
    if existing_admin:
        print("⚠️ Admin already exists:", admin_email)
        return

    admin = User(username="admin", email=admin_email, role="admin")
    admin.set_password("admin123")  # change to a strong password
    session.add(admin)
    session.commit()
    print(f"✅ Admin user created: {admin_email} / admin123")
    session.close()

if __name__ == "__main__":
    create_admin()
