# Wingstamp Bureau

A mobile puzzle about a paper moth and very serious paperwork. Each perch stamps a letter, then advances its own stamp. Revisit perches to fill a receipt and return home.

Eight solver-checked routes. Offline. Touch controls, undo, hints and local progress. Android and iOS projects use Capacitor 8.6.0.

- [Test on Android or iPhone](../../docs/wingstamp/TEST-ON-YOUR-PHONE.md)
- [Originality research and limits](../../docs/wingstamp/ORIGINALITY.md)

```sh
npm ci
npm test
npm run sync
npm run android  # Android Studio
npm run ios      # macOS + Xcode 26+
```

Native source: `android/` and `ios/`. Web source: `src/`. `npm run build` produces `dist/`. Native projects bundle those assets locally; they do not load a hosted URL.
