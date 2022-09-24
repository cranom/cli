import process from "process"
import Conf from "conf"
import chalk from "chalk"


const config = new Conf()

export function isLoggedIn() {
  const userid = config.get("userid")
  const access = config.get("access")
  const refresh = config.get("refresh")
  if (userid && access && refresh) {
    return
  } else {
    console.log(chalk.red("ERROR: ")+ "Seems your not logged in.")
    console.log("Please run:")
    console.log("\t"+ chalk.cyan("cranom login"))
    process.exit(1)
  }
}