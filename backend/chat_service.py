from fastapi import APIRouter, WebSocket
from typing import Dict, List

router = APIRouter()
active_connections: Dict[str, List[WebSocket]] = {}

@router.websocket("/chat/{username}")
async def chat_websocket(websocket: WebSocket, username: str):
    await websocket.accept()
    if username not in active_connections:
        active_connections[username] = []
    active_connections[username].append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Expected format: "receiver: message"
            if ":" in data:
                receiver, message = data.split(":", 1)
                if receiver in active_connections:
                    for conn in active_connections[receiver]:
                        await conn.send_text(f"{username}: {message}")
    except Exception:
        active_connections[username].remove(websocket)
