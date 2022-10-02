/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildArtifact, uploadArtifact } from "./artifact";
import Conf from "conf"
import axios from "axios"
import chalk from "chalk"
import { BASE_URL } from "../shared/constants";
import process from "process"
import { deployDocker } from "./docker";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';


const config = new Conf()
const log = console.log

const token = config.get("access")


export async function deploy(projName: string, opts: {image: string}) {
  const info = await getProjectInfo(projName)
  if (info.type === "docker") {
    // Get Image
    if (opts.image) {
      deployDocker(projName, opts.image, info)
    } else {
      const r1 = readline.createInterface({ input, output });
      log(chalk.bold("Enter Docker image including the tag:"))
      const img = await r1.question(chalk.gray(">>> "))
      r1.close()
      deployDocker(projName, img, info)
    }
    
  } else {
    const artifact = await buildArtifact()
    uploadArtifact(projName, artifact, info)
  }
  
  
}


export type ProjectInfo = {
  "exists": boolean,
  "name": string,
  "version": number,
  "uuid": string,
  "deployed": boolean,
  "type": "docker" | "local" | "git"
}


export async function getProjectInfo(name: string) : Promise<ProjectInfo> {
  const info = {} as ProjectInfo
  log(
    chalk.cyan("INFO: ") + chalk.gray("Fetching project Info")
  )
  try {
    //
    const res = await axios.post(BASE_URL + "deployments/get/project/info/", {
      project: name,
    }, {
      headers: {
        Authorization: "Bearer " + token,
      }
    })
    const data = res.data as ProjectInfo
    return data
  } catch (err: any) {
    if (err.response) {
      if (err.response.data) {
        log(`${chalk.red("Error: ")}${chalk.gray("Seems like project with name")} ${chalk.cyan(name)} ${chalk.gray("does not exists")}`)
        process.exit(1)
      }
    } else {
      log(chalk.red("A connection Error Occured"))
      process.exit(1)
    }
  }

  return info
}



