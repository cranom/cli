<div style="text-align: center;">
<img height="100" src="https://www.cranom.ml/_next/static/media/cranom.b39e3f9a.svg" alt="cranom logo" styl="width: 100px;height: 100px;text-align: center;">
<h1>Cranom CLI</h1>
<p>A commandline client for working with the Cranom Platform.</p>
</div>

Cranom CLI is a node based command line client that is used to work with the [Cranom platform](http://cranom.ml).

## Requirements

To install cranom cli your system should meet this requrement

- Node version 17 and Above

> Due to the fact that most platforms dont use the latest verison of node js. You can use [nvm](https://github.com/nvm-sh/nvm) to have multiple versions of Node js on your paltform.

## Installation

You can install Cranom CLI using any Node JS package manager that has access to the NPM Registry.

```sh
npm install -g cranom-cli
```

Using Yarn

```sh
yarn global add cranom-cli
```

## Usage

When you install Cranom CLI you will have access to the `cranom` command.

```txt  
$ cranom

Cranom CLI v0.0.1
Usage: cranom [options] [command]

A commandline client for working with the Cranom Platform.

Options:
  -V, --version            output the version number
  -h, --help               display help for command

Commands:
  login [options]          Login the client to access Cranom
  deploy [options] <name>  Build and deploy app airtifact to Cranom
  create [options] <name>  Create a new Project
  logs <project>           Get logs for a specific deployment
  logout                   Remove access tokens and userinfo from this machine
  help [command]           display help for command

```

Vists the Documentation for usage on Cranom