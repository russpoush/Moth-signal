# Moth Signal — Android and iOS

A five-round Morse listening game, packaged separately from Wingstamp Bureau. Decode a word from beeps, a flashing lamp, or a written hint. Includes speed controls, an expanded Morse chart, larger phone controls and offline assets. Playback stops when the app goes into the background. Sound mutes immediately; flashes have their own switch and respect reduced-motion defaults. With both off, written-only play earns full points.

```sh
npm ci
npm test
npm run sync
npm run android  # Android Studio
npm run ios      # macOS and Xcode 26+
```

The bundle ID is `com.russpoush.mothsignal`. Native projects live in `android/` and `ios/`; web source is in `src/`. No remote server or paid membership is needed for local testing. No accounts, ads, analytics or device permissions are needed for gameplay.

[Phone testing instructions](../../docs/moth-signal/TEST-ON-YOUR-PHONE.md)

Thirteen automated tests cover Morse accuracy, timing, scoring, all five rounds, duplicate submissions, replay/restart and background cancellation of audio and lamp pulses. Real phone sound, touch and safe-area playtesting remains to be done. A successful native build is compilation validation, not a physical-device playtest.
