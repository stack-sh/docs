import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

export function validateRelease(lock, release, revision) {
  const errors = []
  if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name)) {
    errors.push("Expected a published stable CLI release")
  }
  if (release.tag_name !== `v${lock.version}`) {
    errors.push(
      `CLI release drift: docs ${lock.version}, latest ${release.tag_name}; run npm run release:sync`,
    )
  }
  if (revision !== lock.revision)
    errors.push("CLI release tag commit differs from the documentation pin")
  return errors
}

export function synchronizeVersion(source, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Invalid CLI version")
  if (!/Stack CLI \d+\.\d+\.\d+/.test(source)) throw new Error("Missing CLI version declaration")
  return source.replace(/Stack CLI \d+\.\d+\.\d+/g, `Stack CLI ${version}`)
}

async function github(endpoint) {
  const headers = { Accept: "application/vnd.github+json" }
  if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`
  const response = await fetch(`https://api.github.com/repos/stack-sh/cli/${endpoint}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`GitHub ${endpoint}: HTTP ${response.status}`)
  return response.json()
}

export async function latestRelease() {
  const release = await github("releases/latest")
  if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name)) {
    throw new Error("Expected a published stable CLI release")
  }
  let { object } = await github(`git/ref/tags/${encodeURIComponent(release.tag_name)}`)
  for (let depth = 0; object.type === "tag" && depth < 4; depth += 1) {
    ;({ object } = await github(`git/tags/${object.sha}`))
  }
  if (object.type !== "commit" || !/^[a-f0-9]{40}$/.test(object.sha)) {
    throw new Error("CLI release tag does not resolve to a commit")
  }
  return { release, revision: object.sha }
}
async function main() {
  const lockPath = new URL("../content/cli-release.json", import.meta.url)
  const lock = JSON.parse(await readFile(lockPath, "utf8"))
  const { release, revision } = await latestRelease()
  if (process.argv.includes("--sync")) {
    await writeFile(lockPath, JSON.stringify({ repository: "stack-sh/cli", revision, version: release.tag_name.slice(1) }, null, 2) + "\n")
    const { generate } = await import("./generate.mjs")
    await generate()
  } else {
    const errors = validateRelease(lock, release, revision)
    if (errors.length) throw new Error(errors.join("\n"))
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
