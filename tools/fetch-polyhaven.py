# Descarga modelos CC0 de Poly Haven (glTF 1k), los empaqueta como .glb (webp + meshopt) en game/assets/models
# y los añade a manifest.json (models + credits). Uso: python3 -I tools/fetch-polyhaven.py <gltf-transform> <id>...
import sys, json, os, subprocess, urllib.request, tempfile, shutil
GT = sys.argv[1]; ids = sys.argv[2:]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mf = os.path.join(root, 'game/assets/manifest.json')
man = json.load(open(mf))
H = {'User-Agent': 'bodycam-asset-fetch/1.0'}
def get(u, dst=None):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=120)
    if dst is None: return json.load(r)
    os.makedirs(os.path.dirname(dst), exist_ok=True); open(dst, 'wb').write(r.read())
for mid in ids:
    out = os.path.join(root, 'game/assets/models', mid + '.glb')
    if os.path.exists(out): print('ya existe', mid); continue
    try:
        files = get('https://api.polyhaven.com/files/' + mid)['gltf']
        res = '1k' if '1k' in files else sorted(files)[0]
        g = files[res]['gltf']
        tmp = tempfile.mkdtemp()
        main = os.path.join(tmp, os.path.basename(g['url']))
        get(g['url'], main)
        for rel, inc in g.get('include', {}).items(): get(inc['url'], os.path.join(tmp, rel))
        subprocess.run([GT, 'optimize', main, out, '--texture-compress', 'webp', '--texture-size', '1024',
                        '--compress', 'meshopt', '--simplify', 'false', '--instance', 'false', '--join', 'false', '--flatten', 'false'],
                       check=True, capture_output=True, timeout=600)
        shutil.rmtree(tmp)
        man['models'][mid] = 'models/' + mid + '.glb'
        c = 'Poly Haven · %s (CC0)' % mid
        if c not in man['credits']: man['credits'].append(c)
        print('ok', mid, res, round(os.path.getsize(out) / 1e6, 2), 'MB')
    except Exception as e:
        print('FALLO', mid, getattr(e, 'stderr', b'')[-300:] if hasattr(e, 'stderr') else e)
json.dump(man, open(mf, 'w'), indent=1, ensure_ascii=False)
