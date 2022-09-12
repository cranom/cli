import axios from "axios"
import { BASE_URL } from "../shared/constants"
import Conf from "conf"
import chalk from "chalk"
import process from "process"

const config = new Conf()
const log = console.log

export function create(name: string, opts: {type: "docker" | "local" | "git"}) {
  //console.log(opts)
  console.log(opts)
  createProject(name, opts)
}

function createProject(name: string, opts: {type: "docker" | "local" | "git"}) {
  const token = config.get("access")
  const userId = config.get("userid")
  axios.post(BASE_URL + "deployments/create/project/", {
    name: name,
    user: userId,
    project_type: opts.type
  }, {
    headers: {
      Authorization: "Bearer " + token
    }
  }).then((res)=>{
    const data = res.data
    log(
      `Created project named ${chalk.cyanBright(name)}`
    )
    log(
      `Project UUID: ${chalk.greenBright(data.project_uuid)}`
    )
  }).catch((err)=>{
    
    if (err.response) {
      if (err.response.data) {
        log(`${chalk.red("Error: ")}${chalk.gray("Seems like project with name")} ${chalk.cyan(name)} ${chalk.gray("already exists")}`)
        process.exit(1)
      }
    } else {
      log(chalk.red("A connection Error Occured"))
      process.exit(1)
    }
  })
}

