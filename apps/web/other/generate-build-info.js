const fs = require("fs")
const path = require("path")

const fetch = require("node-fetch")

const commit = process.env.COMMIT_SHA

async function getCommit() {
  if (!commit) return `No COMMIT_SHA environment variable set.`
  try {
    const res = await fetch(`https://api.github.com/repos/danestves/danestves.dev/commits/${commit}`)
    const data = await res.json()
    return {
      isDeployCommit: commit === "HEAD" ? "Unknown" : true,
      sha: data.sha,
      author: data.commit.author.name,
      date: data.commit.author.date,
      message: data.commit.message,
      link: data.html_url,
    }
  } catch (error) {
    return `Unable to get git commit info: ${error.message}`
  }
}

async function main() {
  const buildInfo = {
    buildTime: Date.now(),
    commit: await getCommit(),
  }

  fs.writeFileSync(path.join(__dirname, "../public/web/build/info.json"), JSON.stringify(buildInfo, null, 2))
  console.log("build info generated", buildInfo)
}
main()
