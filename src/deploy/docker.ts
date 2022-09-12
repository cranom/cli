import process from "process"
import chalk from "chalk"
import { ProjectInfo } from ".";
import axios from "axios"
import Conf from "conf"
import { BASE_URL } from "../shared/constants";

const log = console.log
const config = new Conf()

const token = config.get("access")



export function deployDocker(project: string, image: string, info: ProjectInfo) {
  //
  axios.post(BASE_URL + "deployments/create/",{
    "user": config.get("userid"),
    "project": info.uuid,
    "version": info.version + 1,
    "image": image
  }, {
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(res=>{
    const data = res.data
    log(chalk.greenBright("SUCCESS: ")+ "Deployed project " +chalk.cyan(project) + " successfully.")
    log("\t" + chalk.gray("Deployment UUID: ")+ chalk.yellow(`${data.deployment_uuid}`))
    log("\t" + chalk.gray("Version: ") + chalk.yellow(`v${data.version}`))
    log("\t"+chalk.gray("Time: ")+chalk.yellow(`${data.created_at.slice(0, 20).replace("T", " ")}`))
  }).catch(err=>{
    console.log(err.response)
    process.exit(1)
  })
}