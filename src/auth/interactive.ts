import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import chalk from "chalk"

const log = console.log

export async function getLoginInfoInteractive() : Promise<{
  username: string,
  token: string
}>
{
  const r1 = readline.createInterface({ input, output });
  log(chalk.bold("Enter your username:"))
  const username = await r1.question(chalk.gray(">>> "))
  r1.close()
  const r2 = readline.createInterface({ input, output });
  log(chalk.bold("Enter your token:"))
  const token = await r2.question(chalk.gray(">>> "))
  r2.close()


  return {
    username: username,
    token: token
  }
}