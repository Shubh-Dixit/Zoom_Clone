"""
Punto de entrada principal de la aplicación FastAPI.
Monta el servidor Socket.IO como sub-aplicación ASGI.
"""
import os
import logging
from contextlib import asynccontextmanager

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import engine, Base
from routers import meetings_router, scheduled_router
from services.socket_service import sio

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Crea todas las tablas al arrancar si no existen.
    Importar los modelos aquí garantiza que Base los registre.
    """
    import models  # noqa: F401 — registra los modelos en Base.metadata
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created / verified")
    yield
    logger.info("Application shutting down")


app = FastAPI(
    title="ZoomCall API",
    description="Backend para el clon de Zoom — ZoomCall Video Conferencing",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS: permite peticiones desde el frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers REST
app.include_router(meetings_router)
app.include_router(scheduled_router)


@app.get("/api/health")
def health_check():
    """Endpoint de salud para verificar que el servidor está corriendo."""
    return {"status": "ok", "service": "ZoomCall API v2"}


# Montar Socket.IO como ASGI sub-aplicación en /ws
socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="/ws/socket.io")
