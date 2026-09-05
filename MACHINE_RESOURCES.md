# Machine resource distribution

## Discovery and versioning

Discover the current manifest at `https://stack-diagram.com/machine/index.json`.
Its `current` record provides a versioned manifest URL and SHA-256. Version 1 is
published at `https://stack-diagram.com/machine/v1.0.0/manifest.json`, with its JSON
Schema at the adjacent `manifest.schema.json` URL. The site serves these generated
artifacts; source and generation are owned here. Language resources remain owned
by the specification repository, linked at immutable Git commits with byte hashes.

The manifest includes the language specification, highlighting grammar, normalized
IR and diagnostic schemas, protocol-neutral language-intelligence schemas, example
catalog and every example source, canonical conformance fixtures, and a JSON
diagnostic catalog derived from the specification's portable-code table.

## Compatibility

Read `schemaVersion` and `requiredReaderFeatures` before using the manifest. Reject
unsupported reader requirements or an unknown schema version. Select one named
implementation and check the requested capability explicitly. Absence means
unsupported by this snapshot, not that another implementation or future release
cannot support it. CLI 0.4.0, Engine 0.7.0, and the pinned compiler snapshot have
different capabilities. Compiler `document-symbols` does not imply that the WASM
adapter exposes it; protocol schemas do not imply CLI JSON-output support.

Versions in this manifest are a tested, immutable compatibility snapshot, not a
claim to always represent the latest CLI. Current installation guidance uses the
separate release lock and freshness audit. A future snapshot gets a new manifest
version and URL. Existing resource bytes, versions, and digests must not be edited
in place after publication, including to correct a mistake. Publish a replacement,
move discovery, and document the correction instead.

Stack source is not JSON: these schemas validate interchange envelopes and result
objects, not `.stack` syntax. Use the compiler or engine to validate Stack source.
The TextMate grammar highlights syntax; it is not a semantic validator. Relative
schema references resolve against their immutable canonical resource URL, not the
manifest URL. Every referenced schema is also listed in the manifest.

## Cache, integrity, and lifecycle

Revalidate the mutable discovery document using normal HTTP conditional requests;
do not treat it as an indefinitely immutable cache entry. Cache versioned manifests
and commit-addressed resources by their verified SHA-256. Verify downloaded bytes
before parsing or caching and fail on retrieval errors or mismatches. Hashes prove
integrity relative to the manifest, not publisher identity: trust the HTTPS
discovery origin or a separately reviewed manifest digest. Do not silently replace
a pinned resource with a mutable `main` URL or a different version.

Keep published versioned artifacts available when discovery moves. Deprecation
does not delete an old artifact. A security/legal takedown, if unavoidable, should
be documented in the repository and release notes; clients must report retrieval
failure rather than downgrade verification. No runtime service, credentials,
source upload, or vendor artwork distribution is introduced by this index.

## Validation and consumer example

```sh
npm ci --ignore-scripts
npm run generate
npm test
npm run machine:check
node examples/read-machine-resources.mjs --local
```

The example uses generated local discovery/manifest files with `--local`, but still
retrieves upstream resources through immutable URLs and checks their hashes. Omit
the flag after website publication to test the public discovery endpoint.

CI validates all resource hashes, the manifest and upstream schemas, the derived
diagnostic catalog, rendered examples, actual WASM diagnostics/completion/hover,
and the pinned native compiler's full normalized-IR/language-intelligence suites.
Client fixtures cover unsupported capabilities, malformed hashes, mutable URLs,
missing content, and altered resources. Provider icon examples may render fallback
icons without installed packs; this is not proof that vendor artwork was loaded.

`content/machine-resources-v1.json` records hashes extracted from the pinned
specification commit. When preparing a new snapshot, recalculate from those exact
Git object bytes (including invalid-UTF-8 fixtures), not text-decoded copies. The
diagnostic table must continue to match the pinned specification in CI.
