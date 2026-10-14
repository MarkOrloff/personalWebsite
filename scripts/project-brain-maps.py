"""Project NeuroVault group t maps onto fsaverage5 for the 3D brain viewer.

Requires numpy, nibabel and scipy.
Usage: python scripts/project-brain-maps.py /path/to/brain-source /path/to/maps [study]
study is orloff-2026 (default) or raithel-2023; see STUDIES below.
The brain-source directory holds the fsaverage5 files listed in public/brains/provenance.json
plus white_{left,right}.gii.gz.
orloff-2026: the maps directory holds image-<id>.nii.gz and the matching image-<id>.api.json
responses from https://neurovault.org/api/images/<id>/ (collection 21751).
raithel-2023: the maps directory holds the SPM T maps from NeuroVault collection TPTJBHBU, whose
API is private; their metadata is written out below from the collection page.
Writes one public/brains/overlays/<map>.json per map (see STUDIES) and the study's provenance file.

Each map is shown only where it matters for the walkthrough: surface clusters above its display threshold
that touch an expected region (entorhinal cortex, medial prefrontal cortex, anterior piriform cortex).
Everything else is left blank, and the captions say so. Each kept region also gets an outline ring
(the vertices just outside its clusters), drawn when a reader picks that region's name.
"""
from pathlib import Path
import sys, json, hashlib
import numpy as np
import nibabel as nib
from scipy import stats, ndimage
from scipy.ndimage import map_coordinates
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components

anatomy, maps = Path(sys.argv[1]), Path(sys.argv[2])
study_key = sys.argv[3] if len(sys.argv) > 3 else 'orloff-2026'
output = Path(__file__).resolve().parents[1] / 'public/brains/overlays'
output.mkdir(parents=True, exist_ok=True)
revision = 'aee5750ead87eb4147f65c5d4239b4150e839ed1'
nilearn = f'https://raw.githubusercontent.com/nilearn/nilearn/{revision}/nilearn/datasets/data/fsaverage5'
STUDIES = {
    'orloff-2026': {
        'study': 'Orloff et al., A cognitive map of subjective value space for human risky choice (bioRxiv preprint, 2026); NeuroVault collection 21751',
        'provenance': 'provenance.json', 'df': 34, 'check_p': 0.01,
        'note': ('Display only, uncorrected, and only clusters touching entorhinal or medial prefrontal cortex. The paper\'s '
                 'tests are corrected within independently defined regions.'),
        # Each map: display threshold (one-sided P), and the image whose clusters are kept for each expected region.
        # Each threshold is the lowest of 0.05, 0.01 and 0.005 at which the kept clusters stay near their region
        # instead of merging across a lobe.
        'maps': {'neurovault-1009070': {'name': 'subjective grid-like code', 'p': 0.05, 'regions': {'ec': '1009070', 'mpfc': '1009070'}},
                 'neurovault-1009072': {'name': 'subjective 2D positional code', 'p': 0.01, 'regions': {'ec': '1009072', 'mpfc': '1009072'}}},
        # Peak coordinates reported in the preprint for the subjective maps.
        'peaks': {'1009070': {'right EC': [30, -16, -36], 'mPFC': [-6, 36, -10]},
                  '1009072': {'left EC': [-34, 2, -36], 'right EC': [26, 6, -40], 'mPFC': [14, 38, 14]}},
    },
    'raithel-2023': {
        'study': ('Raithel et al., Recruitment of grid-like responses in human entorhinal and piriform cortices by odor '
                  'landmark-based navigation (Current Biology, 2023); NeuroVault collection TPTJBHBU'),
        'provenance': 'provenance-raithel-2023.json', 'df': 27, 'check_p': 0.001,
        'note': ('Display only, uncorrected. Each region shows the clusters touching it in the map whose grid orientation was '
                 'measured in that region (leave-one-out across participants). The paper\'s main tests are within anatomically '
                 'defined regions.'),
        # Their vmPFC region of interest is a 5 mm sphere here; anterior piriform is near (+-22, 5, -18).
        'peaks': {'796768': {'vmPFC ROI center': [6, 46, -10]}, '796968': {'left APC': [-22, 5, -18], 'right APC': [22, 5, -18]}},
        'maps': {'neurovault-raithel-2023': {'name': 'grid-like code in entorhinal and anterior piriform cortex, each with its own grid orientation',
                                             'p': 0.005, 'regions': {'ec': '796768', 'piriform': '796968'}}},
        'images': {'796968': {
            'name': 'aligned vs misaligned movement, grid orientation estimated in anterior piriform cortex',
            'file': 'spmT_0001_1.nii.gz', 'collection': 'TPTJBHBU',
            'image_page': 'https://neurovault.org/collections/TPTJBHBU/',
            'source_url': 'https://neurovault.org/media/images/TPTJBHBU/spmT_0001_1.nii.gz',
            'map_type': 'T map', 'participants': 28, 'template': 'MNI152 (SPM12)',
        }, '796768': {
            'name': 'aligned vs misaligned movement, grid orientation estimated in right entorhinal cortex',
            'file': 'spmT_0001.nii.gz', 'collection': 'TPTJBHBU',
            'image_page': 'https://neurovault.org/collections/TPTJBHBU/',
            'source_url': 'https://neurovault.org/media/images/TPTJBHBU/spmT_0001.nii.gz',
            'map_type': 'T map', 'participants': 28, 'template': 'MNI152 (SPM12)',
        }},
    },
}
study = STUDIES[study_key]
# fsaverage surface coordinates are MNI305. FreeSurfer's CoordinateSystems page (item 8)
# gives this linear MNI305 -> MNI152 matrix. Residual nonlinear template differences remain.
MNI305_TO_152 = np.array([[0.9975, -0.0073, 0.0176, -0.0429],
                          [0.0146, 1.0009, -0.0024, 1.5496],
                          [-0.0130, -0.0093, 0.9971, 1.1840],
                          [0, 0, 0, 1]])
DEPTHS = np.linspace(0, 1, 7)  # white (0) to pial (1)
DF, SCALE = study['df'], 100
# Anterior piriform cortex (paleocortex) falls in FreeSurfer's medial-wall label on fsaverage, so it is
# found by distance instead: vertices whose mid-thickness lies within 12 mm of this MNI152 point.
APC = {'left': [-22, 5, -18], 'right': [22, 5, -18]}
PIRIFORM_RADIUS = 12


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def metadata(image_id):
    """Image file and description: the NeuroVault API response, or the record above for a private collection."""
    if 'images' in study:
        record = study['images'][image_id]
        return maps / record['file'], {**record, 'api': None, 'source_file_name': record['file']}
    path = maps / f'image-{image_id}.nii.gz'
    meta = json.loads((maps / f'image-{image_id}.api.json').read_text())
    assert str(meta['id']) == image_id and meta['map_type'] == 'T map' and float(meta['statistic_parameters']) == DF
    assert meta['target_template_image'].startswith('MNI152') and meta['number_of_subjects'] == DF + 1
    return path, {'name': meta['name'], 'collection': meta['collection'], 'image_page': meta['url'].replace('http://', 'https://'),
                  'api': f'https://neurovault.org/api/images/{image_id}/', 'source_url': meta['file'].replace('http://', 'https://'),
                  'source_file_name': meta['file'].rsplit('/', 1)[-1], 'map_type': meta['map_type'],
                  'participants': meta['number_of_subjects'], 'template': meta['target_template_image']}


surfaces = {}
for hemi in ['left', 'right']:
    h = hemi[0] + 'h'
    pial, faces = nib.load(anatomy / f'pial_{hemi}.gii.gz').agg_data()
    white, white_faces = nib.load(anatomy / f'white_{hemi}.gii.gz').agg_data()
    reference, _ = nib.freesurfer.read_geometry(anatomy / f'{h}.pial')
    assert np.array_equal(pial, reference) and np.array_equal(faces, white_faces) and white.shape == (10242, 3)
    destrieux, _, names = nib.freesurfer.read_annot(anatomy / f'{hemi}.aparc.a2009s.annot')
    dk, _, dk_names = nib.freesurfer.read_annot(anatomy / f'{h}.aparc.annot')
    dk_names = [n.decode() for n in dk_names]
    # Region masks from export-brain-surface.py: medial prefrontal is vmPFC plus mPFC.
    exported = json.loads((Path(__file__).resolve().parents[1] / f'public/brains/fsaverage5-{hemi}.json').read_text())
    n = len(pial)
    edges = np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]], faces[:, [2, 0]]])
    neighbors = coo_matrix((np.ones(len(edges)), (edges[:, 0], edges[:, 1])), shape=(n, n))
    neighbors = ((neighbors + neighbors.T) > 0).tocsr()
    mid = nib.affines.apply_affine(MNI305_TO_152, (pial + white) / 2)
    mask = lambda indices: np.isin(np.arange(n), indices)
    regions = {
        'ec': dk == dk_names.index('entorhinal'),
        'mpfc': mask(exported['masks']['vmpfc'] + exported['masks']['mpfc']),
        'piriform': np.linalg.norm(mid - np.array(APC[hemi]), axis=1) < PIRIFORM_RADIUS,
    }
    surfaces[hemi] = {
        'pial': pial, 'white': white, 'neighbors': neighbors, 'regions': regions,
        # The medial wall is not cortex; values there come from white matter, ventricles or thalamus.
        # Piriform cortex is the exception, so its vertices keep their values.
        'medial_wall': destrieux == [n.decode() for n in names].index('Medial_wall'),
        'dk': dk, 'dk_names': dk_names,
    }


def grow(neighbors, selected, steps=1):
    """Adds the vertices sharing an edge with the selection, `steps` times."""
    for _ in range(steps):
        selected = selected | (neighbors @ selected.astype(float) > 0)
    return selected

images, sampled = {}, {}


def surface_values(image_id):
    """The image sampled at every vertex of each hemisphere (mean over depths), loaded once."""
    if image_id not in sampled:
        path, meta = metadata(image_id)
        img = nib.load(path)
        assert int(img.header['sform_code']) > 0
        data = np.asarray(img.dataobj, dtype=np.float64)
        data = np.where(np.isfinite(data), data, 0)  # SPM writes NaN outside its brain mask
        to_voxel = np.linalg.inv(img.affine)
        values = {}
        for hemi, s in surfaces.items():
            samples = [map_coordinates(data, nib.affines.apply_affine(to_voxel, nib.affines.apply_affine(MNI305_TO_152, s['white'] + depth * (s['pial'] - s['white']))).T,
                                       order=1, mode='constant', cval=0.0) for depth in DEPTHS]
            values[hemi] = np.mean(samples, axis=0)
        # Volume-space check, independent of the surface projection and of the display threshold.
        check_threshold = float(stats.t.isf(study['check_p'], DF))
        clusters, count = ndimage.label(data > check_threshold)
        sizes = ndimage.sum(np.ones_like(data), clusters, range(1, count + 1))
        largest = []
        for label in np.argsort(sizes)[::-1][:8] + 1:
            voxels = np.argwhere(clusters == label)
            top = voxels[np.argmax(data[clusters == label])]
            largest.append({'voxels': int(sizes[label - 1]), 'peak_t': round(float(data[tuple(top)]), 2),
                            'peak_mni': [round(float(v), 1) for v in nib.affines.apply_affine(img.affine, top)]})
        images[image_id] = {
            'neurovault_image': int(image_id), 'name': meta['name'], 'collection': meta['collection'],
            'image_page': meta['image_page'], **({'api': meta['api']} if meta['api'] else {}),
            'source_url': meta['source_url'], 'source_file_name': meta['source_file_name'],
            'source_bytes': path.stat().st_size, 'source_sha256': sha(path),
            'map_type': meta['map_type'], 'participants': meta['participants'],
            'template': meta['template'], 'voxel_size_mm': [float(z) for z in img.header.get_zooms()[:3]],
            'affine': np.round(img.affine, 4).tolist(),
            'volume_check': {'cluster_forming_threshold': round(check_threshold, 5), 'cluster_forming_p': study['check_p'], 'largest_clusters': largest,
                             'at_reported_peaks': {name: round(float(map_coordinates(data, nib.affines.apply_affine(to_voxel, xyz)[:, None], order=1)[0]), 2)
                                                   for name, xyz in study['peaks'][image_id].items()}},
        }
        sampled[image_id] = values
    return sampled[image_id]


overlays = {}
for output_id, shown_map in study['maps'].items():
    P_VALUE = shown_map['p']
    threshold = float(stats.t.isf(P_VALUE, DF))  # one-sided, df = participants - 1
    result = {'id': output_id, 'name': shown_map['name'], 'statistic': 't', 'df': DF,
              'threshold': round(threshold, 5), 'p': P_VALUE, 'scale': SCALE, 'vertices': 10242,
              'regions': {}, 'outlines': {}}
    check = {'surface': {}}
    peak = 0
    for hemi, s in surfaces.items():
        shown, combined = np.zeros(len(s['pial']), bool), np.zeros(len(s['pial']))
        for region, image_id in shown_map['regions'].items():
            values = surface_values(image_id)[hemi].copy()
            # Piriform cortex falls in the medial-wall label, so its values stay when it is the region shown.
            keep_wall = s['regions']['piriform'] if region == 'piriform' else np.zeros_like(s['medial_wall'])
            values[s['medial_wall'] & ~keep_wall] = 0
            # Connected clusters on the surface; keep those touching the region (or the vertices beside it).
            indices = np.flatnonzero(values > threshold)
            _, cluster = connected_components(s['neighbors'][indices][:, indices], directed=False)
            near = grow(s['neighbors'], s['regions'][region], 2)
            members = np.zeros_like(shown); members[indices[np.isin(cluster, np.unique(cluster[near[indices]]))]] = True
            combined = np.where(members, np.maximum(combined, values), combined)
            shown |= members
            result['regions'][region] = {**result['regions'].get(region, {}), hemi: np.flatnonzero(members).tolist()}
            # The outline is the ring of vertices just outside the region's clusters.
            result['outlines'][region] = {**result['outlines'].get(region, {}), hemi: np.flatnonzero(grow(s['neighbors'], members) & ~members).tolist()}
        quantized = np.where(shown, np.round(combined * SCALE), 0).astype(int)
        result[hemi] = quantized.tolist()
        peak = max(peak, int(quantized.max()))
        labels, counts = np.unique(s['dk'][shown], return_counts=True)
        check['surface'][hemi] = {'shown_vertices': int(shown.sum()),
                                  'by_desikan_label': {s['dk_names'][k]: int(c) for k, c in sorted(zip(labels, counts), key=lambda x: -x[1])}}
    result['max'] = peak / SCALE
    filename = f'{output_id}.json'
    (output / filename).write_text(json.dumps(result, separators=(',', ':')) + '\n')
    overlays[filename] = {
        'name': shown_map['name'], 'df': DF, 'regions': shown_map['regions'],
        'sources': {image_id: images[image_id] for image_id in dict.fromkeys(shown_map['regions'].values())},
        'shown_vertices': {hemi: check['surface'][hemi]['shown_vertices'] for hemi in surfaces}, 'max_t_on_surface': result['max'],
        'output_sha256': sha(output / filename), 'checks': check,
    }
    print(output_id, 'max', result['max'], {h: c['shown_vertices'] for h, c in check['surface'].items()})

provenance = {
    'study': study['study'],
    'method': ('fsaverage5 white and pial surfaces (Nilearn, matching the FreeSurfer reference pial) are taken as MNI305 coordinates and '
               'moved to MNI152 with FreeSurfer\'s linear MNI305-to-MNI152 matrix. Each vertex samples the group t map with trilinear '
               'interpolation at 7 evenly spaced depths from white (0) to pial (1); the mean is kept. Voxels outside the image read as 0. '
               'Destrieux Medial_wall vertices are set to 0, except near anterior piriform cortex. Values are positive-only and thresholded '
               'for display, and only surface clusters touching the expected regions are kept.'),
    'mni305_to_mni152': MNI305_TO_152.tolist(),
    'mni305_to_mni152_source': 'https://surfer.nmr.mgh.harvard.edu/fswiki/CoordinateSystems (item 8)',
    'depths': DEPTHS.tolist(),
    'thresholds': {f'{output_id}.json': {'t': float(stats.t.isf(m['p'], DF)), 'p_one_sided': m['p'], 'df': DF,
                                         'computed_with': f'scipy.stats.t.isf({m["p"]}, {DF})'}
                   for output_id, m in study['maps'].items()},
    'note': study['note'],
    'regions': {'ec': 'Desikan-Killiany entorhinal parcel', 'mpfc': 'vmpfc plus mpfc masks from public/brains',
                'piriform': f'vertices within {PIRIFORM_RADIUS} mm (mid-thickness, MNI152) of {APC}, medial wall included',
                'kept': 'a cluster is kept if any vertex is within two edges of the region'},
    'encoding': ('Per-vertex integers round(t * scale) for shown vertices; 0 = not shown. Arrays follow fsaverage5 vertex order. '
                 'regions[name][hemisphere] lists the shown vertices of each region\'s clusters; outlines[name][hemisphere] the ring around them.'),
    'surfaces': {name: {'url': f'{nilearn}/{name}', 'bytes': (anatomy / name).stat().st_size, 'sha256': sha(anatomy / name)}
                 for name in ['white_left.gii.gz', 'white_right.gii.gz']},
    'overlays': overlays,
}
(output / study['provenance']).write_text(json.dumps(provenance, indent=2) + '\n')
