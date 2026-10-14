"""Rebuild the small website dataset from the archived public MATLAB files.

Usage: python3 scripts/extract-social-conformity.py /path/to/paper-repository
Requires NumPy and SciPy. No model fitting or subject filtering is performed.
"""
import hashlib
import json
import pathlib
import sys

import numpy as np
from scipy.io import loadmat

source = pathlib.Path(sys.argv[1])
files = ['data/OCU_socialReliance_hybrid.mat', 'data/soloRP_SXXX.mat']
hybrid, solo = [loadmat(source / name) for name in files]
rows, groups = [], []
for group, label, count in [('control', 'comparison', 28), ('insula', 'insula lesion', 10), ('acc', 'dacc lesion', 6)]:
    follow = hybrid['medianPosteriorOmegaFollow_' + group].ravel()
    # Match fig1.m: group arrays, NOT the separate combined log_lik variable.
    nll = -np.median(solo['log_lik_' + group], axis=1)
    assert len(follow) == len(nll) == count
    assert np.isfinite(follow).all() and np.isfinite(nll).all()
    assert ((follow >= 0) & (follow <= 1)).all()
    for i, (weight, fit) in enumerate(zip(follow, nll)):
        rows.append(dict(id=f'{group}-{i + 1:02d}', group=group,
                         label=f'{label} participant {i + 1:02d}',
                         follow=float(weight), soloNll=float(fit)))
    groups.append(dict(id=group, label=label, n=count, mean=float(np.mean(follow)),
                       sem=float(np.std(follow, ddof=1) / np.sqrt(count))))
assert np.allclose([row['follow'] for row in rows], hybrid['medianPosteriorOmegaFollow'].ravel())
assert round(np.corrcoef([r['follow'] for r in rows], [r['soloNll'] for r in rows])[0, 1], 2) == .52
dataset = dict(source=dict(
    repository='https://code.vt.edu/maorloff/insula-lesions-and-social-heuristic',
    commit='27620f1444434327dacb5216b69509bf923f877f',
    doi='10.1371/journal.pcbi.1012602',
    files={name: hashlib.sha256((source / name).read_bytes()).hexdigest() for name in files},
    extraction='Following: supplied participant posterior medians. Solo fit: negative median log likelihood from group arrays, matching fig1.m. Intervals: group mean +/- SEM, matching functions/SEM.m. Labels are display indices, not original subject identifiers.'
), groups=groups, participants=rows)
output = pathlib.Path(__file__).resolve().parents[1] / 'src/data/social-conformity.json'
output.write_text(json.dumps(dataset, indent=2) + '\n')
print(f'Wrote {len(rows)} participants to {output}')
