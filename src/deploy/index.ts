/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildArtifact } from "./buildatifact";
import Conf from "conf"
import axios, { AxiosRequestConfig } from "axios"
import chalk from "chalk"
import { BASE_URL } from "../shared/constants";
import FormData from "form-data"
import process from "process"


const config = new Conf()
const log = console.log

const token = config.get("access")

axios.defaults.headers.common['Authorization'] = "Bearer " + token

export async function deploy(projName: string) {
  const info = await getProjectInfo(projName)
  const artifact = await buildArtifact()
  uploadArtifact(projName, artifact, info)
}

function uploadArtifact(project: string,artifact: Buffer, info : ProjectInfo) {
  log("\n")
  log(
    chalk.cyan("INFO: ") + "Uploading deployment Artifact. Please wait"
  )
  const formdata = new FormData()
  formdata.append("zipped_project", artifact, {
    filename: "deployment.zip",
    contentType: "application/octet-stream"
  })
  formdata.append("project", info.uuid)
  formdata.append("user", config.get("userid"))
  formdata.append("version", info.version + 1)

  const axiosConfig : AxiosRequestConfig = {
    headers: {
      ...formdata.getHeaders()
    },
  }
  axios.post(BASE_URL + "deployments/create/", formdata.getBuffer(), axiosConfig).then(res=>{
    
    const data = res.data
    
    log(
      chalk.greenBright("SUCCESS: ") + "Deployed project " +chalk.cyan(project) + " successfully."
    )
    log(
      "    " + chalk.gray("Deployment UUID: ") + chalk.yellow(`${data.deployment_uuid}`)
    )
    log(
      "    " + chalk.gray("Version: ") + chalk.yellow(`v${data.version}`)
    )
    log(
      "    " + chalk.gray("Time: ") + chalk.yellow(`${data.created_at.slice(0, 20).replace("T", " ")}`)
    )
  }).catch(err=>{
    console.log(err.response)
    process.exit(1)
  })
}

type ProjectInfo = {
  "exists": boolean,
  "name": string,
  "version": number,
  "uuid": string,
  "deployed": boolean
}


async function getProjectInfo(name: string) : Promise<ProjectInfo> {
  const info = {} as ProjectInfo
  log(
    chalk.cyan("INFO: ") + chalk.gray("Fetching project Info")
  )
  try {
    //
    const res = await axios.post(BASE_URL + "deployments/get/project/info/", {
      project: name,
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



/* 
  axios.post(BASE_URL + "deployments/get/project/info/", {
    project: name,
  }).then(res => {
    info = res.data
  }).catch((err)=>{
    if (err.response) {
      if (err.response.data) {
        log(`${chalk.red("Error: ")}${chalk.gray("Seems like project with name")} ${chalk.cyan(name)} ${chalk.gray("does not exists")}`)
        process.exit(1)
      }
    } else {
      log(chalk.red("A connection Error Occured"))
      process.exit(1)
    }
  }) */