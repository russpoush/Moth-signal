# Moth Signal
A five-round Morse listening game for night-shift moth operators. Decode a randomly selected word using audio, a flashing lamp, or a written hint. No account, backend, or user data storage.

## Run and verify
Node 20+: `npm test`, then `npm run build`. Serve `dist/` with a static host.

## Accuracy
International Morse table and timing follow ITU-R M.1677-1: https://www.itu.int/rec/R-REC-M.1677-1-200910-I/en
Dots: one unit; dashes: three; symbol gaps: one; letter gaps: three. PARIS speed: unit duration = 1.2/WPM. Eight tests cover 36 symbols, known words, timing and scoring. Interaction tests cover scoring, replay, hints, completion and restart using a simulated DOM; real browser/audio QA is unavailable in this environment.

## Environments
Separate owner-private Sites instances: dev → test → prod. The identical built application assets are promoted; only environment.json and the hosting project ID differ. See DEPLOYMENTS.md for deployed URLs. No third-party runtime dependencies; Google Fonts is optional and falls back to local fonts.
