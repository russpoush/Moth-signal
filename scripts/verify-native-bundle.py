"""Verify packaged game resources against the checked-in web build. No signing secrets."""
import hashlib
import json
import sys
from pathlib import Path
from zipfile import ZipFile

if len(sys.argv) != 3:
    raise SystemExit('usage: verify-native-bundle.py android|ios packaged-app-path')
platform, target = sys.argv[1:]
expected = sorted(path for path in Path('dist').rglob('*') if path.is_file())
if not expected:
    raise SystemExit('No web assets found.')
verified = []
if platform == 'android':
    with ZipFile(target) as archive:
        for source in expected:
            relative = source.relative_to('dist').as_posix()
            actual = archive.read('assets/public/' + relative)
            if actual != source.read_bytes():
                raise SystemExit('Packaged Android asset differs: ' + relative)
            verified.append({'path': relative, 'sha256': hashlib.sha256(actual).hexdigest()})
elif platform == 'ios':
    for source in expected:
        relative = source.relative_to('dist').as_posix()
        actual = (Path(target) / 'public' / relative).read_bytes()
        if actual != source.read_bytes():
            raise SystemExit('Packaged iOS asset differs: ' + relative)
        verified.append({'path': relative, 'sha256': hashlib.sha256(actual).hexdigest()})
else:
    raise SystemExit('Unsupported platform.')
report = {'platform': platform, 'asset_count': len(verified), 'assets': verified}
Path('native-verification.json').write_text(json.dumps(report, indent=2) + '\n')
print(f'Verified {len(verified)} packaged {platform} game assets against dist/.')
