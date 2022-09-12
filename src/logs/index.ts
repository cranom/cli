
import { BASE_WS_URL } from "../shared/constants";
import * as ws from "websocket"

export function getlogs() {
  //
  const WebSocketClient = ws.client
  const client = new WebSocketClient()

  client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
  });

  client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
      console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        const data = JSON.parse(message.utf8Data)
        console.log(data.message);
      }
    });
    
  });

  client.connect(BASE_WS_URL + "logs/");

}