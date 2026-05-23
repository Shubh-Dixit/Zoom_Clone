"""
Manejadores de eventos Socket.IO.
Porteados del Flask-SocketIO original, ahora usando python-socketio ASGI.
Mantiene los mismos nombres de eventos para compatibilidad con el frontend.
"""
import json
import logging
from datetime import datetime

import socketio

logger = logging.getLogger(__name__)

# Instancia de Socket.IO (modo ASGI para FastAPI)
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=False,
    engineio_logger=False,
)

# Almacén en memoria de usuarios activos en salas
# Estructura: { meeting_id: { sid: { username, peer_id } } }
active_rooms: dict[str, dict[str, dict]] = {}


@sio.event
async def connect(sid, environ):
    """Se dispara cuando un cliente WebSocket se conecta."""
    logger.info({"sid": sid}, "Socket connected")


@sio.event
async def disconnect(sid):
    """Se dispara cuando un cliente WebSocket se desconecta."""
    logger.info({"sid": sid}, "Socket disconnected")


@sio.on("newUser")
async def on_new_user(sid, msg):
    """
    El cliente anuncia que se unió a una sala.
    Guardamos el usuario y hacemos broadcast a todos en la reunión.
    """
    data = json.loads(msg)
    meeting_id = data.get("meetingID")
    username = data.get("username")
    user_id = data.get("userID")

    logger.info({"username": username, "meeting_id": meeting_id}, "New user joined")

    # Unir el socket a la sala (room = meeting_id)
    await sio.enter_room(sid, meeting_id)

    # Registrar en el almacén de usuarios activos
    if meeting_id not in active_rooms:
        active_rooms[meeting_id] = {}
    active_rooms[meeting_id][sid] = {"username": username, "peer_id": user_id}

    # Broadcast a todos en la sala
    await sio.emit("newUser", msg, room=meeting_id)


@sio.on("checkUser")
async def on_check_user(sid, msg):
    """
    Verifica si ya existe un usuario con el mismo nombre en la sala.
    Responde solo al cliente que lo solicitó.
    """
    data = json.loads(msg)
    meeting_id = data.get("meetingID")
    username = data.get("username")

    room_users = active_rooms.get(meeting_id, {})
    already_exists = any(
        u["username"] == username for u in room_users.values()
    )

    if already_exists:
        await sio.send("userExists", to=sid)
    else:
        await sio.send("userOK", to=sid)


@sio.on("userDisconnected")
async def on_user_disconnected(sid, msg):
    """
    El usuario abandonó la reunión.
    Removemos del almacén y hacemos broadcast a los demás.
    """
    data = json.loads(msg)
    meeting_id = data.get("meetingID")
    username = data.get("username")

    logger.info({"username": username, "meeting_id": meeting_id}, "User disconnected")

    # Limpiar del almacén en memoria
    if meeting_id in active_rooms and sid in active_rooms[meeting_id]:
        del active_rooms[meeting_id][sid]
        if not active_rooms[meeting_id]:
            del active_rooms[meeting_id]

    await sio.leave_room(sid, meeting_id)
    await sio.emit("userDisconnected", msg, room=meeting_id)


@sio.on("message")
async def on_message(sid, msg):
    """
    Mensaje de chat: reenvía a todos los clientes conectados (broadcast global).
    El filtro por meetingID se hace en el cliente para no duplicar lógica.
    """
    await sio.send(msg, broadcast=True)
