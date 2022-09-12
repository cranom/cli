'use strict';

var commander = require('commander');
var chalk = require('chalk');
var axios = require('axios');
var process = require('process');
var Conf = require('conf');
var readline = require('node:readline/promises');
var process$1 = require('node:process');
var AdmZip = require('adm-zip');
var path = require('path');
var fs$1 = require('node:fs/promises');
var ignore = require('ignore');
var fs = require('fs');
var cliProgress = require('cli-progress');
var FormData = require('form-data');
var ws = require('websocket');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var process__default = /*#__PURE__*/_interopDefaultLegacy(process);
var Conf__default = /*#__PURE__*/_interopDefaultLegacy(Conf);
var readline__namespace = /*#__PURE__*/_interopNamespace(readline);
var process__default$1 = /*#__PURE__*/_interopDefaultLegacy(process$1);
var AdmZip__default = /*#__PURE__*/_interopDefaultLegacy(AdmZip);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs$1);
var ignore__default = /*#__PURE__*/_interopDefaultLegacy(ignore);
var cliProgress__default = /*#__PURE__*/_interopDefaultLegacy(cliProgress);
var FormData__default = /*#__PURE__*/_interopDefaultLegacy(FormData);
var ws__namespace = /*#__PURE__*/_interopNamespace(ws);

const BASE_DOMAIN = "127.0.0.1:8000";
const BASE_WS_URL = "ws://" + BASE_DOMAIN + "/";
const BASE_URL = `http://${BASE_DOMAIN}/`;

const log$6 = console.log;
const config$4 = new Conf__default["default"]();
function login(username, token) {
    axios__default["default"].post(BASE_URL + "users/login/cli/", {
        username,
        token
    }).then((res) => {
        const data = res.data;
        config$4.set("access", data.access);
        config$4.set("refresh", data.refresh);
        config$4.set("userid", data.id);
        log$6(chalk__default["default"].green("Successfull login"));
    }).catch((err) => {
        if (err.response) {
            if (err.response.data) {
                log$6(`${chalk__default["default"].red("Error: ")} ${chalk__default["default"].gray(err.response.data.message)}`);
                process__default["default"].exit(1);
            }
        }
        else {
            log$6(chalk__default["default"].red("A connection Error Occured"));
            process__default["default"].exit(1);
        }
    });
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const log$5 = console.log;
function getLoginInfoInteractive() {
    return __awaiter(this, void 0, void 0, function* () {
        const r1 = readline__namespace.createInterface({ input: process$1.stdin, output: process$1.stdout });
        log$5(chalk__default["default"].bold("Enter your username:"));
        const username = yield r1.question(chalk__default["default"].gray(">>> "));
        r1.close();
        const r2 = readline__namespace.createInterface({ input: process$1.stdin, output: process$1.stdout });
        log$5(chalk__default["default"].bold("Enter your token:"));
        const token = yield r2.question(chalk__default["default"].gray(">>> "));
        r2.close();
        return {
            username: username,
            token: token
        };
    });
}

const config$3 = new Conf__default["default"]();
const log$4 = console.log;
function create(name, opts) {
    //console.log(opts)
    console.log(opts);
    createProject(name, opts);
}
function createProject(name, opts) {
    const token = config$3.get("access");
    const userId = config$3.get("userid");
    axios__default["default"].post(BASE_URL + "deployments/create/project/", {
        name: name,
        user: userId,
        project_type: opts.type
    }, {
        headers: {
            Authorization: "Bearer " + token
        }
    }).then((res) => {
        const data = res.data;
        log$4(`Created project named ${chalk__default["default"].cyanBright(name)}`);
        log$4(`Project UUID: ${chalk__default["default"].greenBright(data.project_uuid)}`);
    }).catch((err) => {
        if (err.response) {
            if (err.response.data) {
                log$4(`${chalk__default["default"].red("Error: ")}${chalk__default["default"].gray("Seems like project with name")} ${chalk__default["default"].cyan(name)} ${chalk__default["default"].gray("already exists")}`);
                process__default["default"].exit(1);
            }
        }
        else {
            log$4(chalk__default["default"].red("A connection Error Occured"));
            process__default["default"].exit(1);
        }
    });
}

const log$3 = console.log;
const config$2 = new Conf__default["default"]();
const token$2 = config$2.get("access");
function buildArtifact() {
    return __awaiter(this, void 0, void 0, function* () {
        const zipBuffer = yield createZipBuffer();
        return zipBuffer;
    });
}
function createZipBuffer() {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process__default["default"].cwd();
        const zip = new AdmZip__default["default"]();
        // All files in the working directory
        log$3(chalk__default["default"].cyan("INFO: ") + "Compressing Artifact...");
        const filesStats = yield getFiles(cwd);
        const files = filesStats.filesArray;
        const filesObj = filesStats.detailed;
        const ignoreFile = yield ignoreFileExists();
        let ignoreFilePath = null;
        let finalFiles = [];
        if (ignoreFile.exists) {
            ignoreFilePath = path__default["default"].join(process__default["default"].cwd(), ignoreFile.file);
            finalFiles = ignore__default["default"]()
                .add(fs.readFileSync(ignoreFilePath).toString())
                .filter(files);
        }
        const bar = new cliProgress__default["default"].SingleBar({}, cliProgress__default["default"].Presets.shades_classic);
        bar.start(finalFiles.length, 0, {
            speed: "N/A"
        });
        for (let i = 0; i < finalFiles.length; i++) {
            const file = finalFiles[i];
            for (const item of filesObj) {
                if (item.union === file) {
                    zip.addLocalFile(item.union, item.dir, item.file);
                    bar.update(i + 1);
                }
            }
        }
        bar.stop();
        return zip.toBuffer();
    });
}
function ignoreFileExists() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootDirFiles = yield fs__namespace.readdir(process__default["default"].cwd());
        const ignoreObj = {
            exists: false,
            file: ""
        };
        for (let i = 0; i < rootDirFiles.length; i++) {
            const file = rootDirFiles[i];
            if (file === ".gitignore" || file === ".cranomignore") {
                if (file === ".cranomignore") {
                    ignoreObj.exists = true;
                    ignoreObj.file = ".cranomignore";
                    break;
                }
                else {
                    ignoreObj.exists = true;
                    ignoreObj.file = ".gitignore";
                }
            }
        }
        return ignoreObj;
    });
}
function getFiles(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const pages = [];
        const fileObj = [];
        const initDir = yield fs__namespace.readdir(dir, {
            encoding: "utf-8",
            withFileTypes: true
        });
        for (const item of initDir) {
            if (item.isFile()) {
                const win32Path = path__default["default"].join(dir, item.name);
                const UnixPath = win32Path.replace(/\\/g, "/");
                const realPath = path__default["default"].relative(process__default["default"].cwd(), UnixPath);
                pages.push(realPath);
                fileObj.push({
                    dir: path__default["default"].relative(process__default["default"].cwd(), dir),
                    file: item.name,
                    union: realPath
                });
            }
            else {
                if (item.name !== "node_modules") {
                    const innerPages = yield getFiles(path__default["default"].join(dir, item.name));
                    pages.push(...innerPages.filesArray);
                    fileObj.push(...innerPages.detailed);
                }
            }
        }
        return {
            filesArray: pages,
            detailed: fileObj
        };
    });
}
function uploadArtifact(project, artifact, info) {
    log$3("\n");
    log$3(chalk__default["default"].cyan("INFO: ") + "Uploading deployment Artifact. Please wait");
    const formdata = new FormData__default["default"]();
    formdata.append("zipped_project", artifact, {
        filename: "deployment.zip",
        contentType: "application/octet-stream"
    });
    formdata.append("project", info.uuid);
    formdata.append("user", config$2.get("userid"));
    formdata.append("version", info.version + 1);
    const axiosConfig = {
        headers: Object.assign({ Authorization: "Bearer " + token$2 }, formdata.getHeaders()),
    };
    axios__default["default"].post(BASE_URL + "deployments/create/", formdata.getBuffer(), axiosConfig).then(res => {
        const data = res.data;
        log$3(chalk__default["default"].greenBright("SUCCESS: ") + "Deployed project " + chalk__default["default"].cyan(project) + " successfully.");
        log$3("\t" + chalk__default["default"].gray("Deployment UUID: ") + chalk__default["default"].yellow(`${data.deployment_uuid}`));
        log$3("\t" + chalk__default["default"].gray("Version: ") + chalk__default["default"].yellow(`v${data.version}`));
        log$3("\t" + chalk__default["default"].gray("Time: ") + chalk__default["default"].yellow(`${data.created_at.slice(0, 20).replace("T", " ")}`));
    }).catch(err => {
        console.log(err.response);
        process__default["default"].exit(1);
    });
}

const log$2 = console.log;
const config$1 = new Conf__default["default"]();
const token$1 = config$1.get("access");
function deployDocker(project, image, info) {
    //
    axios__default["default"].post(BASE_URL + "deployments/create/", {
        "user": config$1.get("userid"),
        "project": info.uuid,
        "version": info.version + 1,
        "image": image
    }, {
        headers: {
            Authorization: "Bearer " + token$1
        }
    }).then(res => {
        const data = res.data;
        log$2(chalk__default["default"].greenBright("SUCCESS: ") + "Deployed project " + chalk__default["default"].cyan(project) + " successfully.");
        log$2("\t" + chalk__default["default"].gray("Deployment UUID: ") + chalk__default["default"].yellow(`${data.deployment_uuid}`));
        log$2("\t" + chalk__default["default"].gray("Version: ") + chalk__default["default"].yellow(`v${data.version}`));
        log$2("\t" + chalk__default["default"].gray("Time: ") + chalk__default["default"].yellow(`${data.created_at.slice(0, 20).replace("T", " ")}`));
    }).catch(err => {
        console.log(err.response);
        process__default["default"].exit(1);
    });
}

const config = new Conf__default["default"]();
const log$1 = console.log;
const token = config.get("access");
function deploy(projName, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield getProjectInfo(projName);
        if (info.type === "docker") {
            // Get Image
            if (opts.image) {
                deployDocker(projName, opts.image, info);
            }
            else {
                const r1 = readline__namespace.createInterface({ input: process$1.stdin, output: process$1.stdout });
                log$1(chalk__default["default"].bold("Enter Docker image including the tag:"));
                const img = yield r1.question(chalk__default["default"].gray(">>> "));
                r1.close();
                deployDocker(projName, img, info);
            }
        }
        else {
            const artifact = yield buildArtifact();
            uploadArtifact(projName, artifact, info);
        }
    });
}
function getProjectInfo(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {};
        log$1(chalk__default["default"].cyan("INFO: ") + chalk__default["default"].gray("Fetching project Info"));
        try {
            //
            const res = yield axios__default["default"].post(BASE_URL + "deployments/get/project/info/", {
                project: name,
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
            const data = res.data;
            return data;
        }
        catch (err) {
            if (err.response) {
                if (err.response.data) {
                    log$1(`${chalk__default["default"].red("Error: ")}${chalk__default["default"].gray("Seems like project with name")} ${chalk__default["default"].cyan(name)} ${chalk__default["default"].gray("does not exists")}`);
                    process__default["default"].exit(1);
                }
            }
            else {
                log$1(chalk__default["default"].red("A connection Error Occured"));
                process__default["default"].exit(1);
            }
        }
        return info;
    });
}

function getlogs() {
    //
    const WebSocketClient = ws__namespace.client;
    const client = new WebSocketClient();
    client.on('connectFailed', function (error) {
        console.log('Connect Error: ' + error.toString());
    });
    client.on('connect', function (connection) {
        console.log('WebSocket Client Connected');
        connection.on('error', function (error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function () {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                const data = JSON.parse(message.utf8Data);
                console.log(data.message);
            }
        });
    });
    client.connect(BASE_WS_URL + "logs/");
}

const program = new commander.Command();
const log = console.log;
log(chalk__default["default"].hex('#00FFFF').bold('Cranom CLI v0.0.1'));
program.name("cranom")
    .description("A commandline client for working with the Cranom Platform.")
    .version("0.0.1");
program.command("login")
    .description("Login the client to access Cranom")
    .option("-u, --username <string>", "Your account username")
    .option("-t, --token <string>", "Account token")
    .action((opts) => {
    if (opts.username || opts.token) {
        if (opts.username === undefined || opts.username === null) {
            log(`${chalk__default["default"].red("Error: ")} ${chalk__default["default"].gray("No username was provided")}`);
            process__default$1["default"].exit(1);
        }
        if (opts.token === undefined || opts.token === null) {
            log(`${chalk__default["default"].red("Error: ")} ${chalk__default["default"].gray("No token was provided")}`);
            process__default$1["default"].exit(1);
        }
        login(opts.username, opts.token);
    }
    else {
        getLoginInfoInteractive().then((res) => {
            login(res.username, res.token);
        });
    }
});
program.command("deploy")
    .description("Build and deploy app airtifact to Cranom")
    .argument('<name>', "Name of the Project you want to deploy under")
    .option("-i, --image <string>", "Docker image repository")
    .action((project, opts) => {
    deploy(project, opts);
    return;
});
program.command("create")
    .description("Create a new Project")
    .argument("<name>", "Name of project you want to create")
    .requiredOption("-t, --type <docker|local|git>", "The type of project you want to deploy. ie docker, local, git")
    .action((projectName, opts) => {
    create(projectName, opts);
});
program.command("logs")
    .description("Get logs for a specific deployment")
    .argument("<project>", "The mane of the project whos logs you want to get")
    .action((projectName) => {
    //
    getlogs();
});
program.parse();
