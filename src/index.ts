import { Command } from "commander";
import chalk from "chalk"
import {login} from "./auth/login"
import { getLoginInfoInteractive } from "./auth/interactive";
import process from 'node:process';
import { create } from "./create";
import { deploy } from "./deploy";
import { getlogs } from "./logs";



const program = new Command()
const log = console.log

log(
  chalk.hex('#00FFFF').bold('Cranom CLI v0.0.1')
)


program.name("cranom")
  .description("A commandline client for working with the Cranom Platform.")
  .version("0.0.1")


program.command("login")
  .description("Login the client to access Cranom")
  .option("-u, --username <string>", "Your account username")
  .option("-t, --token <string>", "Account token")
  .action((opts )=>{
    if (opts.username || opts.token){
      if (opts.username === undefined || opts.username === null) {
        log(`${chalk.red("Error: ")} ${chalk.gray("No username was provided")}`)
        process.exit(1)
      }
      if (opts.token === undefined || opts.token === null) {
        log(`${chalk.red("Error: ")} ${chalk.gray("No token was provided")}`)
        process.exit(1)
      }
      login(opts.username, opts.token)
    } else {
      getLoginInfoInteractive().then((res)=> {
        login(res.username, res.token)
      })
    }
  })

program.command("deploy")
  .description("Build and deploy app airtifact to Cranom")
  .argument('<name>', "Name of the Project you want to deploy under")
  .option("-i, --image <string>", "Docker image repository")
  .action((project, opts)=>{
    deploy(project, opts)
    return
  })

program.command("create")
  .description("Create a new Project")
  .argument("<name>", "Name of project you want to create")
  .requiredOption("-t, --type <docker|local|git>", "The type of project you want to deploy. ie docker, local, git")
  .action((projectName, opts)=>{
    create(projectName, opts)
  })

program.command("logs")
  .description("Get logs for a specific deployment")
  .argument("<project>", "The mane of the project whos logs you want to get")
  .action((projectName)=>{
    //
    getlogs()
  })

program.parse()

