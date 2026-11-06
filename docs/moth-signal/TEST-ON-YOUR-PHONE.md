# Test Moth Signal on Android or iPhone

Moth Signal and Wingstamp Bureau are separate apps in the same private repository. Both are on branch `wingstamp-mobile`:

- Moth Signal: `apps/moth-signal`, bundle ID `com.russpoush.mothsignal`.
- Wingstamp Bureau: `apps/wingstamp-bureau`, bundle ID `com.russpoush.wingstampbureau`.

They can be installed side by side.

## Get the Moth Signal project

```sh
git clone --branch wingstamp-mobile https://github.com/russpoush/Moth-signal.git
cd Moth-signal/apps/moth-signal
npm ci
npm test
npm run sync
```

Use Node 22+ (24 recommended). The game bundles all its assets and uses local device audio, with no account, tracking, backend or microphone. Scores last for the current session. Audio and flashing stop when you leave the app; tap Play to begin the signal again.

## Android

Download the **Moth-Signal-Android-debug** artifact from the successful **Moth Signal mobile test builds** workflow in GitHub Actions. Unzip it and install `app-debug.apk` on your test phone. Android may ask you to allow installing from your download source. Alternatively run `adb install -r app-debug.apk` with USB debugging enabled.

To build it yourself, run `npm run android` and click Run in Android Studio, or:

```sh
cd android
./gradlew assembleDebug
./gradlew installDebug
```

Windows uses `gradlew.bat`. Use JDK 21 and Android SDK 36. No paid Google Play account is needed for local debug testing. [Official Android build guide](https://developer.android.com/build/building-cmdline).

## iPhone with a free Personal Team

On your Mac with Xcode 26+, run `npm run ios`. In Xcode:

1. Sign in under Settings → Accounts.
2. Choose the App target → Signing & Capabilities.
3. Enable Automatically manage signing and select your Personal Team.
4. Connect/trust your iPhone and enable Developer Mode when prompted.
5. Select your phone and press Run.

Use `com.russpoush.mothsignal` as the bundle ID, or change it to a unique ID if Xcode reports it unavailable. Free signing expires after seven days; rebuild/reinstall as needed. Paid membership is required for App Store or TestFlight distribution. [Apple account documentation](https://developer.apple.com/help/account/basics/about-your-developer-account).

The **Moth-Signal-iOS-Simulator** artifact contains a Simulator `.app`, not an iPhone IPA. Unzip it and drag `App.app` into a matching iOS Simulator on your Mac. It cannot be installed directly on an iPhone.

## Play

Press Play signal, decode one of the listed words, enter it and tap Send. The Morse chart is always expanded below the answer controls; the guide link jumps to it. Speed and Sound controls are above the answer. Written hints reduce a correct round from 3 points to 1. Replays and wrong guesses have no penalty. Complete five signals to finish a shift.

This is a development test build, not an App Store or Google Play release. Physical-device audio, touch and visual testing remains outstanding.
