# Moth Signal mobile test builds

Version 0.1.1, November 6, 2026. Source: `8d5f0d46219bcfab91e72fd2b27fdfd3b4fdabd7`, branch `wingstamp-mobile`.

[Successful native build run](https://github.com/russpoush/Moth-signal/actions/runs/42315657045)

- **[Android debug APK](https://github.com/russpoush/Moth-signal/actions/runs/42315657045/artifacts/13550024971):** download and unzip to get `app-debug.apk`; install it on your test phone or emulator.
- **[iOS Simulator build](https://github.com/russpoush/Moth-signal/actions/runs/42315657045/artifacts/13550616917):** download and unpack the nested zip to get `App.app`. For a Mac's iOS Simulator only; not an iPhone-installable IPA.
- **[iPhone testing with your free Xcode Personal Team](TEST-ON-YOUR-PHONE.md):** build and run on your phone from `apps/moth-signal/ios`. Xcode 26+ is required. Free signing expires after seven days.

Android Debug and unsigned iOS Simulator compilation passed. Both jobs independently passed all 13 tests before compiling. Local checks also confirmed the two platforms bundle identical game assets and make no remote font or runtime data request. Morse timing, scoring, five-round flow, cancellation during audio startup, background playback cancellation and replay are covered by automated checks.

Artifacts require GitHub sign-in and repository access. They are retained for 30 days, with exact expiry displayed by GitHub. You can rebuild locally or rerun the workflow afterwards.

Physical-device audio, touch, safe-area and visual playtesting has not been performed. This is a development test build, not an App Store or Google Play release.

## Independent audit recheck

The mobile audit agent verified both jobs, Android signature verification, 10/10 packaged game files matching `dist/` on each platform, and a universal x86_64/arm64 Simulator binary. The new tests cover live mute, muting during pending startup, independent flashes/reduced-motion and full-point written-only play. See [the six-agent audit](../audits/2026-11-06-product-audit.md) for sources, corrected issues and remaining limits.
