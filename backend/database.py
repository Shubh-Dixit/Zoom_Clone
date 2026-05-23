"""
Configuración de la base de datos SQLite con SQLAlchemy.
Provee el engine, la sesión y la base declarativa para los modelos.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

# Resolver la ruta absoluta para SQLite — evita problemas con CWD en Render
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_DEFAULT_DB = f"sqlite:///{os.path.join(_BASE_DIR, 'zoomcall.db')}"

DATABASE_URL = os.getenv("DATABASE_URL", _DEFAULT_DB)

# check_same_thread=False es necesario para SQLite con FastAPI (multi-thread)
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Crear engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependencia de FastAPI para inyectar la sesión de base de datos."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
