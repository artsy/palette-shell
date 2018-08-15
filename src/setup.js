const { mkdir, test, ls, exec } = require("shelljs");
const git = require("isomorphic-git");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const os = require("os");

const gitEmitter = new EventEmitter();
const YARN_PATH = path.join(__dirname, "../node_modules/.bin/yarn");
const REPO_PATH = path.join(os.homedir(), ".artsy-design-system");
const gitConfig = {
  fs,
  dir: REPO_PATH,
  url: "https://github.com/artsy/palette",
  emitter: gitEmitter
};

const yarn = (cmd = "install") => {
  const process = exec(`${YARN_PATH} --ignore-engines ${cmd}`, {
    async: true,
    cwd: REPO_PATH
  });
  process.stdout.on("data", data => console.log(data));
  process.stderr.on("data", data => console.error(data));
  return new Promise(resolve => {
    process.on("close", code => resolve(code));
  });
};

gitEmitter.on("message", msg => console.log(msg));

async function setupRepo() {
  if (!test("-d", REPO_PATH)) {
    mkdir(REPO_PATH);
  }

  if (!test("-d", path.join(REPO_PATH, ".git"))) {
    console.log(path.resolve(REPO_PATH));
    await git.clone(gitConfig);
  } else {
    await git.pull(gitConfig);
  }
  await git.checkout({
    ...gitConfig,
    ref: "design-system"
  });

  await yarn();
  await yarn("add --dev node@8");
  yarn("docs");
}

module.exports = setupRepo;

// setupRepo().then(() => {
//   console.log(ls(REPO_PATH));
//   console.log("DONE");
// });
