import assert from "node:assert/strict"
import test from "node:test"
import { synchronizeVersion, validateRelease } from "./cli-release.mjs"

const lock = { version: "0.4.0", revision: "a".repeat(40) }
const release = { tag_name: "v0.4.0", draft: false, prerelease: false }

test("matches a published release and its exact commit", () => {
  assert.deepEqual(validateRelease(lock, release, lock.revision), [])
})
test("rejects a new release omitted from docs", () => {
  assert.match(
    validateRelease(lock, { ...release, tag_name: "v0.5.0" }, lock.revision).join(),
    /release drift/,
  )
})
test("rejects draft, prerelease, and retargeted tags", () => {
  for (const field of ["draft", "prerelease"]) {
    assert.ok(validateRelease(lock, { ...release, [field]: true }, lock.revision).length)
  }
  assert.ok(validateRelease(lock, release, "b".repeat(40)).length)
})
test("updates all declarations without changing unrelated prose or versions", () => {
  assert.equal(
    synchronizeVersion("Stack CLI 0.3.0, Engine 0.7.0, Stack CLI 0.3.0", "0.4.0"),
    "Stack CLI 0.4.0, Engine 0.7.0, Stack CLI 0.4.0",
  )
  assert.throws(() => synchronizeVersion("No declaration", "0.4.0"))
  assert.throws(() => synchronizeVersion("Stack CLI 0.3.0", "main"))
})
