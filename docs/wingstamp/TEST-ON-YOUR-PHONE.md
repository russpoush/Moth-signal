# Wingstamp Bureau: test on Android and iPhone

Wingstamp Bureau is the new candidate, on branch `wingstamp-mobile`. The older Moth Signal web app is preserved. All app code lives in `apps/wingstamp-bureau/`.

## Get the code

```sh
git clone --branch wingstamp-mobile https://github.com/russpoush/Moth-signal.git
cd Moth-signal/apps/wingstamp-bureau
npm ci
npm test
npm run sync
```

Use Node 22+ (24 recommended). No paid membership is needed for these local tests. The app bundles all gameplay assets, has no remote backend, and works offline. It stores only completed routes and best hop counts on the device.

## Android phone or emulator

Download the **Wingstamp-Bureau-Android-debug** artifact from the successful **Wingstamp mobile test builds** run in GitHub Actions. Unzip it to get `app-debug.apk`. Install it on your own phone (allow installation from that download source if Android asks), or use `adb install -r app-debug.apk` with USB debugging enabled.

To build yourself, run `npm run android`, then select a device/emulator in Android Studio and click Run. Use JDK 21, Android SDK 36 and Build Tools requested by Gradle. Alternatively:

```sh
cd android
./gradlew assembleDebug
# Windows: gradlew.bat assembleDebug
./gradlew installDebug
```

The APK is a development build, automatically debug-signed, not a Google Play release. [Official Android instructions](https://developer.android.com/build/building-cmdline).

## iPhone, using your free Apple account

You need a Mac with Xcode 26+ for this Capacitor 8 project. Open the project with:

```sh
npm run ios
```

1. In Xcode → Settings → Accounts, sign in with your Apple account.
2. Select the **App** project, then the **App** target → **Signing & Capabilities**.
3. Enable **Automatically manage signing** and choose your **Personal Team**. No team or signing secrets are committed.
4. Connect and trust your iPhone. Enable Developer Mode if prompted.
5. Select the iPhone as the run destination and press Run.

The bundle ID is `com.russpoush.wingstampbureau`. If Xcode reports it unavailable, change it to a unique identifier under Signing & Capabilities. Free Personal Team provisioning expires after seven days, so rebuild/reinstall when needed. TestFlight and App Store distribution require paid membership. [Apple's account documentation](https://developer.apple.com/help/account/basics/about-your-developer-account).

The **Wingstamp-Bureau-iOS-Simulator** artifact is for a Mac's iOS Simulator only. It is NOT an IPA and cannot be installed on an iPhone. For simulator testing, unzip it and drag `App.app` into a booted matching iOS Simulator. The CI build is unsigned; your own Personal Team is used when you run on a physical phone.

## Play

Start with **HI**. Leave **Guide me** on and tap the big green button three times: H, I, then Home. You can also tap the stop marked NEXT on the map. CAT is the next gentle practice word. Only later deliveries introduce letters that change after a visit. Go back and Start over are free; guided play blocks paths that would leave you stuck. Turn Guide me off whenever you want to plan independently. All words are available under Choose a word.

## What has been checked

Eight Node tests validate all ten levels, keep the first two static, require changed-perch revisits on later routes, verify rule transitions, wrong moves, dead ends, undo state, saved progress, and a simulated touch-button UI completing all routes, guiding each hop, avoiding traps, recovering from independent-play dead ends and preserving earlier progress. The native CI separately compiles Android Debug and an unsigned iOS Simulator app. Those are build checks, not physical-device playtests. Browser visual QA and real-device touch/rotation/safe-area testing still need the devices.
