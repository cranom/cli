import { BASE_URL } from "../shared/constants"
import axios from "axios"
import chalk from "chalk"
import process from "process"
import Conf from "conf"

const log = console.log

const config = new Conf()

export function login(username: string, token: string) {
  axios.post(BASE_URL + "users/login/cli/", {
    username,
    token
  }).then((res)=>{
    const data = res.data
    config.set("access", data.access)
    config.set("refresh", data.refresh)
    config.set("userid", data.id)
    log(chalk.green("Successfull login"))
  }).catch((err)=>{
    if (err.response) {
      if (err.response.data) {
        log(`${chalk.red("Error: ")} ${chalk.gray(err.response.data.message)}`)
        process.exit(1)
      }
    } else {
      log(chalk.red("A connection Error Occured"))
      process.exit(1)
    }

  })
}