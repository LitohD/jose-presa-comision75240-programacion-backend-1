const { createServer } = require('http');
const app = require('./src/server');
const setupWebSocket = require('./src/services/websocket');

const httpServer = createServer(app);
const io = setupWebSocket(httpServer);

app.set('socketio', io);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});