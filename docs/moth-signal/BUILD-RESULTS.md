# Moth Signal mobile test builds

Version 0.1.0, November 6, 2026. Source: `4041d252d120e2904aade428880ce81e48f63137`, branch `wingstamp-mobile`.

[Successful native build run](https://github.com/russpoush/Moth-signal/actions/runs/42309372183)

- **[Android debug APK](https://github.com/russpoush/Moth-signal/actions/runs/42309372183/artifacts/13547687127):** download and unzip to get `app-debug.apk`; install it on your test phone or emulator.
- **[iOS Simulator build](https://github.com/russpoush/Moth-signal/actions/runs/42309372183/artifacts/13548615125):** download and unpack the nested zip to get `App.app`. For a Mac's iOS Simulator only; not an iPhone-installable IPA.
- **[iPhone testing with your free Xcode Personal Team](TEST-ON-YOUR-PHONE.md):** build and run on your phone from `apps/moth-signal/ios`. Xcode 26+ is required. Free signing expires after seven days.

Android Debug and unsigned iOS Simulator compilation passed. Both jobs independently passed all nine tests before compiling. Local checks also confirmed the two platforms bundle identical game assets and make no remote font or runtime data request. Morse timing, scoring, five-round flow, cancellation during audio startup, background playback cancellation and replay are covered by automated checks.

Artifacts require GitHub sign-in and repository access. They are retained for 30 days, until December 6, 2026. You can rebuild locally or rerun the workflow afterwards.

Physical-device audio, touch, safe-area and visual playtesting has not been performed. This is a development test build, not an App Store or Google Play release.
