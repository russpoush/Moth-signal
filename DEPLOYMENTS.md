# Moth Signal environments

Each environment is a separate owner-private Sites app. These are logical dev/test/prod roles; Sites hosts each as an independent production deployment.

| Role | URL | GitHub branch |
| --- | --- | --- |
| Dev | https://moth-signal-dev.blondebike16.chatgpt.site | dev |
| Test | https://moth-signal-test.blondebike16.chatgpt.site | test |
| Prod | https://moth-signal.blondebike16.chatgpt.site | main |

Two validation passes: eight passing Node tests in the development and separate test checkouts. All 36 Morse characters and timing ratios were cross-checked against ITU-R M.1677-1 Annex 1. Application assets are byte-identical across environments; environment.json and hosting.json identify the environment.

Real browser, visual and audible playback QA could not run because the supported browser QA tool is unavailable. Interaction validation uses a simulated DOM, not a real browser. Deployment success is confirmed separately through Sites.

## Updating
Run `npm test` and `npm run build` in dev, deploy dev, promote the same application files to test, repeat the checks and compare file hashes, then promote to main/prod. Preserve each environment's hosting project ID and environment.json. Push source to GitHub and the corresponding Sites source repository before saving/deploying through Sites. The hosting manifests live on their respective branches. No credentials belong in this repository.
