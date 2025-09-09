from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
from typing import Dict, List
from .data import MOCK_TRANSCRIPT, MOCK_METRICS

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, interview_id: str):
        await websocket.accept()
        if interview_id not in self.active_connections:
            self.active_connections[interview_id] = []
        self.active_connections[interview_id].append(websocket)

    def disconnect(self, websocket: WebSocket, interview_id: str):
        if interview_id in self.active_connections:
            self.active_connections[interview_id].remove(websocket)
            if not self.active_connections[interview_id]:
                del self.active_connections[interview_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_interview(self, message: str, interview_id: str):
        if interview_id in self.active_connections:
            for connection in self.active_connections[interview_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Remove broken connections
                    self.active_connections[interview_id].remove(connection)

    async def simulate_interview(self, interview_id: str):
        """Simulate real-time interview transcript and metrics"""
        await asyncio.sleep(1)  # Initial delay
        
        # Send transcript entries
        for entry in MOCK_TRANSCRIPT:
            message = {
                "type": "transcript",
                "data": entry,
                "timestamp": entry["timestamp"]
            }
            await self.broadcast_to_interview(json.dumps(message), interview_id)
            await asyncio.sleep(2)  # Simulate real-time delay
        
        # Send final metrics
        await asyncio.sleep(1)
        message = {
            "type": "metrics",
            "data": MOCK_METRICS,
            "timestamp": MOCK_TRANSCRIPT[-1]["timestamp"] + 10
        }
        await self.broadcast_to_interview(json.dumps(message), interview_id)

manager = ConnectionManager()
