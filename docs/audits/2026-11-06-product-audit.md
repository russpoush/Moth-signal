# Moth Signal and Wingstamp Bureau: product audit

Date: November 6, 2026. Repository: `russpoush/Moth-signal`, branch `wingstamp-mobile`. Baseline: `e231c3f`. Six agents reviewed originality, research accuracy, code/security, native release evidence, accessibility, and marketing. The code and accessibility reviewers separately rechecked the corrective patch.

## Decision

**Suitable for continued private prototype testing; public launch readiness is not established.** Wingstamp Bureau is the stronger differentiated candidate. Moth Signal has substantial prior name/theme overlap and should not be promoted as a novel or uniquely named product. Neither app has demonstrated age suitability, educational effectiveness, demand, retention, revenue potential, or store approval.

This is an evidence-backed assessment, not a certification that everything is correct, globally original, legally cleared, accessible to everyone, or safe on every device.

| Area | Finding | Evidence and limit |
| --- | --- | --- |
| Morse accuracy | Verified against the primary reference | 36/36 characters match ITU; timing and PARIS calculation independently checked. Actual phone timing/latency unmeasured. |
| Wingstamp puzzles | Verified by automated exploration | All 24 words are solvable; eight static practice routes, sixteen changing-stamp routes. This does not establish fun or difficulty for real players. |
| Code behavior | Tests passed; concrete bugs corrected | Independent checks, mock DOM/Web Audio tests and targeted reproductions. No real-browser or physical-device playtest. |
| Mobile build provenance | Recorded builds genuinely exist | Exact source SHAs, successful Android/iOS jobs, artifact IDs and digests verified against GitHub. Debug Android and unsigned Simulator builds only. |
| Code/asset authenticity | Development history inspected | App logic and authored SVG assets are in incremental commits; native scaffolding comes from Capacitor. This is not an exhaustive external-code/image similarity comparison. |
| Dependency security | No known npm advisories returned on the audit date | Both agents' complete npm audits reported zero. Native Maven/Swift dependency advisories and a penetration test are not covered. |
| Privacy | Gameplay architecture checked; wording corrected | No accounts, in-game analytics, ads or gameplay service calls found. Native local storage can be included in OS backups. Hosted previews have service logs. |
| Accessibility | Several source-level issues corrected | Contrast calculations, control sizes and focus logic checked. No WCAG certification, assistive-technology or representative-age validation. |
| Originality | Moth: overlap; Wingstamp: differentiated candidate | Public primary listings and exact-name searches. No trademark/patent clearance or universal novelty proof. |
| Marketing | Positioning hypotheses only | Competitor descriptions verified. No outreach, ads, market-size claims, user study or commercial validation performed. |

## Confirmed findings and corrections

| Finding | Before | Correction / status |
| --- | --- | --- |
| Moth live mute | Sound was read only when Play started; unchecking it did not stop scheduled audio. | Immediate oscillator cancellation; Sound checked again after asynchronous audio resume. Lamp playback can continue. Regression tests cover active and pending playback. |
| Moth flashes | No independent switch; reduced-motion only affected CSS transitions. | Independent Flashes switch, off by default for reduced-motion, and callback guards after switching off. |
| Equivalent written play | Written help previously always reduced a correct round to one point. | With Sound and Flashes off, written-only play earns full three points. The optional Reveal hint in other modes still earns one. This is a deliberate accessibility mode, not competitive anti-cheat scoring. |
| Empty Morse timeline | `timeline('',12)` returned a negative duration, although UI words could not trigger it. | Complete normalized word is validated before scheduling. |
| Keyboard focus | Wingstamp rebuilt focused map/word buttons; Moth hid the final Next button without moving focus. | Wingstamp restores current-stop or heading focus, including Undo to the initial state. Moth completion focuses Restart. |
| Contrast | Wingstamp receipt heading 4.284:1; inactive routes 2.890:1; Moth input boundary 2.433:1 against panel. | Calculated source ratios now 4.839:1, 3.834:1, and 4.260:1 respectively. Rendered pixels and zoom behavior remain unmeasured. |
| Backup claims | Wingstamp promised progress stays only on the device and uninstall removes it, while Android backup was enabled. | Local-storage wording now discloses OS backups/transfers and possible restore after reinstall. Backup behavior was not exercised on a device. |
| Debug APK updates | Instructions implied every APK could replace an earlier install with `adb install -r`. | Added signing-source mismatch explanation, same-key option, uninstall fallback and progress implications. Signing secrets remain outside source. |
| Native fallback art | Generic Android splash still had Capacitor template artwork. | Replaced the generic fallback in both apps. Qualified splash variants and active adaptive-icon references were already branded. An unused Android vector is not evidence of an incorrect live icon. |
| Attribution | No app-authored bundled notices page accompanied the SDK. | Added offline Capacitor MIT text, Apache 2.0 text, Cordova notice and AndroidX attribution. Complete native transitive-dependency notice/obligation inventory remains a release task. |
| Research description | Letterfall was incorrectly called a falling-letter game. | Corrected to removing one letter and rearranging the remaining letters into shorter words. |
| Ambiguous novelty copy | Moth README called it “The original … game.” | Changed to “A five-round Morse listening game.” |

These corrections do not rename either app or establish legal clearance. They also do not change the difficulty or introduce weekly word packs.

## Originality, names and research authenticity

### Moth Signal

- [Neon Moth Signal on Google Play](https://play.google.com/store/apps/details?id=com.celestora.neon.moth.signal), updated July 13, 2026, describes moth couriers and flashing-lamp signal matching. This is close name/theme overlap, not proof of identical Morse gameplay.
- [Chitin](https://fuzzyzilla.itch.io/chitin) is a 2024 one-button game. Its [creator explicitly describes it as “Moths and Morse Code”](https://fuzzyzilla.itch.io/). Its action mechanics differ, but the moth/Morse combination predates this project.
- [Morsle](https://morsle.fun/) already uses Morse-word listening and guessing. [Morse Mania](https://apps.apple.com/us/app/morse-mania-learn-morse-code/id1511042196) advertises audio/visual practice, offline play and hundreds of levels.
- [Moth Signal by Taya Rooh](https://music.amazon.com/tracks/B0F9YPQ1JY), dated May 23, 2025, establishes prior exact-phrase use outside games. It does not establish a game trademark conflict.

**Conclusion:** keep development claims factual; reconsider the name before investing in public branding. “First,” “never done before,” and “verified original” are unsupported.

### Wingstamp Bureau

No exact full-name game match was located in the searches. That is a negative search finding, not proof of availability. Standalone Wingstamp is already used in [Heroka cosmetics](https://www.heroka.nl/collections/alle-producten/products/wingstamp-eyeliner).

Relevant first-party precedents:

| Existing work | Shared element | Distinction supported by published descriptions |
| --- | --- | --- |
| [TYPING](https://typing2122.itch.io/typing), 2022 | Plan a movement path to form a word | Changing state is carried on a rolling die, rather than independently at each perch. |
| [Mosslight Post Office](https://zendenclaws.itch.io/mosslight-post-office), September 2026 | Moth-carried mail and route planning | Changing forest routes/timing, rather than constructing a receipt from cycling letter stamps. |
| [Letterfall: Word Stamps](https://apps.apple.com/gb/app/letterfall-word-stamps/id6828188640) | Words, stamps and postal presentation | Removes one letter and rearranges the remainder; it does not describe revisited graph perches. |
| [Parcel Chorus](https://ayyoubaha.itch.io/parcel-chorus) | Stateful postal routes and undo | Linked directional switches route parcels, rather than independently cycling letter stops. |

**Conclusion:** the particular combination—independently changing stamps, planned revisits, ordered receipt and return Home—is a defensible differentiation hypothesis. Common components and the postal/moth theme are established. Competitor pages were read; the competing binaries were not independently played or decompiled.

Searches included exact names/variants and game/app terms across general web, Google Play, Apple App Store, Steam, itch.io and GitHub. The user's new repository and hosted pages were excluded as prior examples. Search indexing, private/unreleased work and unsearched jurisdictions limit the conclusion. No comprehensive trademark-register or patent search was performed.

## Accuracy and platform facts

The research reviewer separately transcribed the table in [ITU-R M.1677-1 Annex 1](https://www.itu.int/dms_pubrec/itu-r/rec/m/R-REC-M.1677-1-200910-I!!PDF-E.pdf). All 26 letters and 10 digits agree. Dots/dashes last one/three units; within-letter/letter gaps last one/three. [ARRL's PARIS convention](https://www.arrl.org/files/file/Technology/x9004008.pdf) supports 50 units including the following word gap: `unit=1.2/WPM`. At 8/12/18 WPM, dots are 150/100/66.667 ms. Web Audio schedules 600 Hz tones; JavaScript timers drive lamp state, so device synchronization must still be measured.

The moths and postal rules are explicitly fictional. No biological facts, learning efficacy, memory improvement or child-development outcomes have been established.

[Apple permits own-device tests through a free Personal Team](https://developer.apple.com/help/account/basics/about-your-developer-account); provisioning expires after seven days. Paid membership is needed for TestFlight/App Store distribution. [Android debug builds are automatically signed and installable locally](https://developer.android.com/build/building-cmdline), without a paid Play publisher account. Current project settings match [Capacitor 8 requirements](https://capacitorjs.com/docs/getting-started/environment-setup): Node 22+, Xcode 26+, iOS 15+, Android SDK 36 / minimum SDK 24 and Java 21.

## Validation and release evidence

Baseline build provenance independently confirmed:

| App | Source | Successful run |
| --- | --- | --- |
| Wingstamp 0.3.0 | `b772e69080c24326b84b62de75ef8d475b92cd34` | [42308707704](https://github.com/russpoush/Moth-signal/actions/runs/42308707704) |
| Moth 0.1.0 | `4041d252d120e2904aade428880ce81e48f63137` | [42309372183](https://github.com/russpoush/Moth-signal/actions/runs/42309372183) |

Recorded artifact IDs, expiry dates and SHA256 digests matched GitHub metadata. Local web builds matched both synchronized native resource trees. Artifact storage downloads returned Forbidden in this workspace, so this was not a locally downloaded APK signature or installed-binary inspection.

The corrective pipelines add Android `apksigner verify` and compare every packaged `dist/` resource with its source build. iOS Simulator packaging checks its actual app resources and records architecture. These are CI-side binary checks, not physical-device gameplay.

Current corrected checks and native build links are recorded in [Moth build results](../moth-signal/BUILD-RESULTS.md) and [Wingstamp build results](../wingstamp/BUILD-RESULTS.md). Tests are source/model validation: 13 native Moth, 8 Wingstamp and 12 legacy web Moth checks. They include muting, pending resume, output toggles, full-point written-only play, completion focus, puzzle solvability, guidance, undo and retained progress.

The repository's mobile PR remains a draft. Builds are development artifacts on `wingstamp-mobile`, not signed store releases or a main-branch production promotion pipeline. Artifacts expire after 30 days; there is no committed signing key. Real phone audio, touch, text scaling, keyboard behavior, VoiceOver/TalkBack, rotation, safe areas, backups and enjoyment remain unverified.

### Post-correction verification completed

The independent mobile reviewer checked the fresh logs at source `8d5f0d46219bcfab91e72fd2b27fdfd3b4fdabd7`. Both Android APKs pass signature verification; every packaged game file matches the tested build. Both Simulator apps contain x86_64 and arm64 architectures.

| App | Fresh successful run | Tests per native job | Packaged files per platform |
| --- | --- | --- | --- |
| Moth 0.1.1 | [42315657045](https://github.com/russpoush/Moth-signal/actions/runs/42315657045) | 13/13 | 10/10 |
| Wingstamp 0.3.1 | [42315657325](https://github.com/russpoush/Moth-signal/actions/runs/42315657325) | 8/8 | 11/11 |

The first added Android-verification attempt failed because the runner lacked ripgrep. The check was changed to locate build tools with Python's standard library; the complete corrected runs above passed. This failure and correction concern CI portability, not a failed application signature.

The revised browser experiences were also deployed successfully: [Wingstamp](https://wingstamp-bureau.blondebike16.chatgpt.site), [Moth dev](https://moth-signal-dev.blondebike16.chatgpt.site), [Moth test](https://moth-signal-test.blondebike16.chatgpt.site), and [Moth production](https://moth-signal.blondebike16.chatgpt.site). Moth's built app files matched between test and production; only hosting identity and environment label differ. Native store releases remain unsubmitted.

## Marketing: defensible copy and hypotheses

**Recommended lead candidate: Wingstamp Bureau.** Its changing-stamp mechanic is more distinctive than its cozy moth theme. The current eight static introductory words and default solver guidance may hide that hook or feel too easy to some players; this is a hypothesis supported by this conversation, not a representative usability study. Test an optional early changing-stamp preview and invitation to try independent planning while keeping assistance available.

Factual draft copy, not a published listing:

> **Wingstamp Bureau — A changing-stamp word puzzle.** Help a paper moth collect letters and return Home. Play 24 deliveries, with eight gentle practice words followed by stamps that change when you revisit them. Choose step-by-step guidance or plan your own route. Undo freely. No timer. The native game works offline and saves progress locally; OS backups may apply.

> **Moth Signal — Five quiet Morse messages.** Decode five messages drawn from ten night-themed words. Listen to beeps, use optional flashes, or choose written-only play. Replay freely, adjust speed and keep the Morse chart nearby. Sound and flashes have independent switches. The native game works offline.

Do not claim global originality, “easy for everyone,” age suitability, improved memory, proven educational benefit, audience demand, guaranteed store acceptance, or commercial success. Do not promise weekly releases: recurring packs are not implemented. Do not say either is available on the App Store or Google Play.

### Formative validation plan

1. Observe 12 voluntary sessions: four younger readers with a parent present, four adult puzzle players, and four older adults. This is a small formative sample, not representative research.
2. Let participants start without explaining the rules. Record anonymous counts for first action, first completion, help discovery, mistaken taps, and stopping reasons. Ask consent before recording anything.
3. Test one static and one changing-stamp Wingstamp delivery. Ask the player to explain why a return visit helps, then try independent play.
4. Test Moth with sound, flashes disabled and written-only mode. Check understanding of dots/dashes, replay and scoring. Include VoiceOver/TalkBack and large-text trials separately.
5. Compare the descriptions “route-planning word puzzle” and “guided letter delivery.” Check whether expectations match the experience.
6. Observe voluntary return over a week. Ask whether people want new words, new routes, harder independent play or clearer guidance before committing to weekly packs.

No participants were recruited, and no outreach, posts, email, ads or store metadata were sent by this audit.

## Open public-launch decisions

- Resolve Moth Signal naming/positioning before spending on its brand; obtain appropriate name-rights review if pursuing launch. Wingstamp's full name still lacks legal clearance.
- Complete real-device and assistive-technology tests and representative-age observation; do not infer these from large buttons or compilation.
- Complete the shipped native dependency/license inventory and publication metadata. Added notices address known components but are not a complete legal compliance opinion.
- Prepare a genuinely public privacy-policy URL and support contact before store submission. Owner-private test previews do not meet a public-policy URL requirement.
- Choose accurate audience/store declarations. If targeting children, apply the relevant store category/families rules rather than advertising broad age suitability without evidence.
- Assess sustained entertainment and content value. [Apple guideline 4.2](https://developer.apple.com/app-store/review/guidelines/) and [Google functionality/content](https://support.google.com/googleplay/android-developer/answer/9898783?hl=en-GB) require meaningful value. Capacitor packaging itself does not prove acceptance or rejection. [Google's privacy policy requirement](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en-en) applies even to apps that do not collect personal data.

These are launch-preparation gaps, not reasons to stop private testing. No evidence currently supports a revenue forecast, market-size estimate, paid acquisition recommendation or claim of product-market fit.

## Artifact integrity metadata

GitHub-reported ZIP digests, independently checked by the mobile reviewer. These identify artifact ZIPs, not a separately downloaded APK hash.

| Artifact | ID | SHA256 |
| --- | --- | --- |
| Moth Android | 13550024971 | `800b2477108feef4fc82f8d4325eb7f18d4271b97025a5a3e8b8fe3f1fd66e83` |
| Moth Simulator | 13550616917 | `12f4fd7e35ad134e587844f711482fce99ce46274264cde3cef21a008fbfed39` |
| Wingstamp Android | 13550856020 | `b854e6db04c53c2c9c45141cb7112102c5f194986b49221fc23db1987d4fcff3` |
| Wingstamp Simulator | 13551150497 | `fb149eb4b135f707f3850562da06a60457f760173d298e5546707eb1c3c5b1cf` |
