
import { BASE_URL, BASE_WS_URL } from "../shared/constants";
import * as ws from "websocket"
import process from "process"
import axios from "axios"
import Conf from "conf"
import { getProjectInfo } from "../deploy";


const config = new Conf()


async function getWsToken() {
  const access = config.get("access")
  let res = null
  try {
    res = await axios.get(BASE_URL + "deployments/get/token/ws/", {
      headers: {
        Authorization: "Bearer " + access
      }
    })
  } catch {
    console.log("An Error Occured")
    process.exit(1)
  }
  return res.data.token
}


export async  function getlogs(name: string) {
  const projInfo = await getProjectInfo(name)
  const wstoken = await getWsToken()
  const WebSocketClient = ws.client
  const client = new WebSocketClient()

  client.on('connectFailed', function(error) {
    console.log("Failed")
    console.log('Connect Error: ' + error.message);
  });

  client.on('connect', function(connection) {
    connection.on('error', function(error) {
      console.log("Error")
      console.log("Connection Error: " + error.message);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    process.on("SIGINT", (_)=>{
      connection.sendUTF(JSON.stringify({
        message: "END"
      }))
      console.log("Exiting logs, Please wait...")
      connection.close()
      process.exit()
    })
    
    
  });

  const url = `${BASE_WS_URL}logs/${projInfo.uuid}/${wstoken}/`
  //console.log(url)

  client.connect(url);
}