HACVS
=====

An HMI-Interface for IP-Symcon with LCARS-Style.
Frontend uses pure HTML5 technologies: Canvas, Javascript, WebSocket

For communication with IP-Symcon a additional server, called
BridgeServer, is required. This server pulls all updates from
IP-Symcon, filters required data and pushes these updated data
to the Frontend via WebSocket.
