# Mobile test build results

Version 0.2.0 — easier guided play, November 6, 2026. Source: `0cb0315e7109afdaf9d00179f41c49789a2cbf53`, branch `wingstamp-mobile`.

[Successful build run](https://github.com/russpoush/Moth-signal/actions/runs/42307072241)

- **[Android debug APK artifact](https://github.com/russpoush/Moth-signal/actions/runs/42307072241/artifacts/13547240566):** download and unzip to get `app-debug.apk`. Android compilation passed on Ubuntu with JDK 21.
- **[iOS Simulator artifact](https://github.com/russpoush/Moth-signal/actions/runs/42307072241/artifacts/13546887450):** download and unzip, then unpack the inner simulator zip to get `App.app`. Unsigned Simulator compilation passed on macOS with Xcode. Not installable on an iPhone; use the [Personal Team instructions](TEST-ON-YOUR-PHONE.md) for your phone.
- Both native jobs independently passed all eight Node tests before compiling. The UI test completes all ten words using the large guided button, checks undo, keeps earlier progress, prevents guided dead ends, and offers recovery after independent play. HI and CAT use static letters; changing letters begin at the third word.
- Local checks verified both native projects bundle identical `dist/` game assets and have no remote server configured.
- The game is also available as a [private browser companion](https://wingstamp-bureau.blondebike16.chatgpt.site). Its deployment succeeded.

Artifacts are stored for 30 days, until December 6, 2026; rerun the workflow or build locally afterwards. GitHub sign-in and repository access are required to download them.

Physical Android/iPhone playtesting, real-browser visual QA, and store submission have not been performed. Native build success establishes compilation and packaging, not a physical-device playtest.
