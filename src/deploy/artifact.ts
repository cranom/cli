import process from "process"
import AdmZip from "adm-zip"
import path from "path"
import * as fs from 'node:fs/promises';
import ignore from 'ignore'
import { readFileSync } from "fs";
import cliProgress from "cli-progress"
import chalk from "chalk"
import { ProjectInfo } from ".";
import FormData from "form-data"
import axios, { AxiosRequestConfig } from "axios"
import Conf from "conf"
import { BASE_URL } from "../shared/constants";

const log = console.log
const config = new Conf()

const token = config.get("access")

export async function buildArtifact() {
  const zipBuffer = await createZipBuffer()
  return zipBuffer
}

async function createZipBuffer() : Promise<Buffer> {
  const cwd = process.cwd()
  const zip = new AdmZip()
  // All files in the working directory
  log(chalk.cyan("INFO: ") + "Compressing Artifact...")
  const filesStats = await getFiles(cwd)
  const files = filesStats.filesArray
  const filesObj = filesStats.detailed
  const ignoreFile = await ignoreFileExists()
  let ignoreFilePath = null
  let finalFiles: string[] = []
  if (ignoreFile.exists) {
    ignoreFilePath = path.join(process.cwd(), ignoreFile.file)
    finalFiles = ignore()
      .add(readFileSync(ignoreFilePath).toString())
      .filter(files)
  }
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(finalFiles.length, 0, {
    speed: "N/A"
  })
  for (let i = 0; i < finalFiles.length; i++) {
    const file = finalFiles[i];
    for (const item of filesObj) {
      if (item.union === file) {
        zip.addLocalFile(item.union, item.dir, item.file)
        bar.update(i+1)
      }
    }
  }
  bar.stop()

  return zip.toBuffer()
}

async function ignoreFileExists() {
  const rootDirFiles = await fs.readdir(process.cwd())
  const ignoreObj = {
    exists: false,
    file: ""
  }
  for (let i = 0; i < rootDirFiles.length; i++) {
    const file = rootDirFiles[i];
    if (file === ".gitignore" || file === ".cranomignore") {
      if (file === ".cranomignore") {
        ignoreObj.exists = true
        ignoreObj.file = ".cranomignore"
        break
      } else {
        ignoreObj.exists = true
        ignoreObj.file = ".gitignore"
      }
    }
  }
  return ignoreObj
}

export async  function getFiles(dir: string): Promise< { filesArray: string[]; detailed: { dir: string; file: string; union: string; }[]; }> {
  const pages = []
  const fileObj = []
  const initDir = await fs.readdir(dir, {
    encoding: "utf-8",
    withFileTypes: true
  })
  for (const item of initDir) {
    if (item.isFile()) {
      const win32Path = path.join(dir, item.name)
      const UnixPath = win32Path.replace(/\\/g, "/")
      const realPath = path.relative(process.cwd(), UnixPath)
      pages.push(realPath)
      fileObj.push({
        dir: path.relative(process.cwd(), dir),
        file: item.name,
        union: realPath
      })
    } else {
      
      if (item.name !== "node_modules") {
        const innerPages = await getFiles(path.join(dir, item.name))
        pages.push(...innerPages.filesArray)
        fileObj.push(...innerPages.detailed)
      }
      
    }
  }
  return {
    filesArray: pages,
    detailed: fileObj
  }
}


export function uploadArtifact(project: string,artifact: Buffer, info : ProjectInfo) {
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
      Authorization: "Bearer " + token,
      ...formdata.getHeaders()
    },
  }
  axios.post(BASE_URL + "deployments/create/", formdata.getBuffer(), axiosConfig).then(res=>{
    
    const data = res.data
    
    log(
      chalk.greenBright("SUCCESS: ") + "Deployed project " +chalk.cyan(project) + " successfully."
    )
    log(
      "\t" + chalk.gray("Deployment UUID: ") + chalk.yellow(`${data.deployment_uuid}`)
    )
    log(
      "\t" + chalk.gray("Version: ") + chalk.yellow(`v${data.version}`)
    )
    log(
      "\t" + chalk.gray("Time: ") + chalk.yellow(`${data.created_at.slice(0, 20).replace("T", " ")}`)
    )
  }).catch(err=>{
    console.log(err.response)
    process.exit(1)
  })
}