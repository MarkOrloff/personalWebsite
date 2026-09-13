"""Extract only the published Fig. 1B estimates from the archived allVars.mat.

Usage: python3 scripts/extract-peer-influence.py /path/to/allVars.mat
Requires scipy. Source commit is pinned below; no survey covariates or original
participant identifiers are exported. Display numbers are generated here.
"""
import json, sys, hashlib
from pathlib import Path
import numpy as np
from scipy.io import loadmat
source = Path(sys.argv[1])
a = loadmat(source, simplify_cells=True)
points = []
counts = {'naive': 0, 'exposed': 0}
for safe, risky, exposed in zip(a['OCUsafe_trans'], a['OCUrisky_trans'], a['anySubUse']):
    group = 'exposed' if exposed else 'naive'
    counts[group] += 1
    points.append({'id': f'{group}-{counts[group]:02}', 'group': group,
                   'safe': float(safe), 'risky': float(risky)})
assert len(points) == 78
assert all(0 <= p[k] <= 1 for p in points for k in ['safe', 'risky'])
result = {
    'source': {'doi': '10.1073/pnas.1919111117', 'figure': '1B',
               'repository': 'https://code.vt.edu/maorloff/adolescent-peer-influence',
               'commit': '4e1da2673f3abfe952d0525c315b4ca7e804a172',
               'file': 'data/allVars.mat', 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
               'variables': ['OCUsafe_trans', 'OCUrisky_trans', 'anySubUse'],
               'transform': 'Archived transformed estimates: logistic(inverse temperature × other-conferred utility). 0.5 denotes zero added utility.'},
    'groups': [{'id': group, 'label': 'no reported substance use' if group == 'naive' else 'reported substance use', 'n': counts[group]} for group in counts],
    'participants': points
}
Path('src/data/peer-influence.json').write_text(json.dumps(result, indent=2)+'\n')
for g in counts:
    print(g, counts[g], {k: float(np.mean([p[k] for p in points if p['group']==g])) for k in ['safe','risky']})
