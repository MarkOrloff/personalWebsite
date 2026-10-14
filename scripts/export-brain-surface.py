"""Export public fsaverage5 anatomy for both hemispheres.

Requires numpy, nibabel, scipy and scikit-image.
Usage: python scripts/export-brain-surface.py /path/to/downloaded/source/files
Writes public/brains/fsaverage5-left.json, fsaverage5-right.json and provenance.json.
Source URLs, hashes and anatomical definitions are recorded in provenance.json.
"""
from pathlib import Path
import sys, json, hashlib
import numpy as np
import nibabel as nib
from scipy.ndimage import gaussian_filter
from skimage.measure import marching_cubes

source = Path(sys.argv[1])
output = Path(__file__).resolve().parents[1] / 'public/brains'
output.mkdir(parents=True, exist_ok=True)
revision = 'aee5750ead87eb4147f65c5d4239b4150e839ed1'
nilearn = f'https://raw.githubusercontent.com/nilearn/nilearn/{revision}/nilearn/datasets/data/fsaverage5'
fsbase = 'https://www.freesurfer.net/pub/dist/freesurfer/tutorial_versions_centos6/freesurfer/subjects/fsaverage5'
# Nilearn's Destrieux fetcher uses NITRC file ids 9343 (lh) and 9342 (rh).
destrieux = {'left': 'https://www.nitrc.org/frs/download.php/9343/lh.aparc.a2009s.annot',
             'right': 'https://www.nitrc.org/frs/download.php/9342/rh.aparc.a2009s.annot'}
# FreeSurfer LUT: Left-Hippocampus 17, Right-Hippocampus 53.
hippocampus_label = {'left': 17, 'right': 53}
seg = nib.load(source / 'aseg.mgz')
volume = np.asarray(seg.dataobj)
# HCP-MMP1 (Glasser et al. 2016) on fsaverage, for mPFC; fsaverage5 vertices are the first 10242 fsaverage vertices.
hcp_urls = {'lh': 'https://ndownloader.figshare.com/files/5528816', 'rh': 'https://ndownloader.figshare.com/files/5528819'}


def centered(vertices):
    center = (vertices.max(axis=0) + vertices.min(axis=0)) / 2
    return (vertices - center) / (np.ptp(vertices, axis=0).max() * .60)


def export(hemi):
    h = hemi[0] + 'h'
    pial, faces = nib.load(source / f'pial_{hemi}.gii.gz').agg_data()
    sulc = nib.load(source / f'sulc_{hemi}.gii.gz').agg_data()
    labels, _, names = nib.freesurfer.read_annot(source / f'{hemi}.aparc.a2009s.annot')
    dk, _, dk_names = nib.freesurfer.read_annot(source / f'{h}.aparc.annot')
    reference_pial, reference_faces = nib.freesurfer.read_geometry(source / f'{h}.pial')
    assert pial.shape == (10242, 3) and faces.shape == (20480, 3)
    assert np.array_equal(pial, reference_pial) and np.array_equal(faces, reference_faces)
    assert len(sulc) == len(labels) == len(dk) == len(pial)
    assert np.isfinite(pial).all()
    names = [name.decode() for name in names]
    # The masks below use Destrieux indices; both hemispheres share one name table.
    for index, name in {6: 'G_and_S_cingul-Ant', 7: 'G_and_S_cingul-Mid-Ant', 18: 'G_insular_short', 31: 'G_rectus',
                        32: 'G_subcallosal', 48: 'S_circular_insula_ant', 64: 'S_orbital_med-olfact', 71: 'S_suborbital'}.items():
        assert names[index] == name, (hemi, index, names[index])

    pial_center = (pial.max(axis=0) + pial.min(axis=0)) / 2
    pial_scale = np.ptp(pial, axis=0).max() * .60

    # Broad anatomical neighborhoods for a public orientation guide, not functional ROIs.
    # Include the lower medial wall, rather than labeling only the orbital surface vmPFC.
    x, y, z = pial.T
    vmpfc = np.isin(labels, [31, 32, 64, 71]) | ((labels == 6) & (z < 10))
    dk_names = [name.decode() for name in dk_names]
    ec_index = dk_names.index('entorhinal')
    assert ec_index == 6
    # Anterior cingulate: aMCC (Destrieux 7) plus the dorsal part of the anterior parcel (6).
    # Desikan-Killiany splits parcel 6 into rostral ACC and medial OFC (the pregenual/subgenual
    # wrap around the genu) versus superior frontal and caudal ACC (the part above it). Keep the latter.
    dorsal_dk = np.isin(dk, [dk_names.index('superiorfrontal'), dk_names.index('caudalanteriorcingulate')])
    masks = {
        'vmpfc': np.flatnonzero(vmpfc).tolist(),
        'acc': np.flatnonzero((labels == 7) | ((labels == 6) & dorsal_dk)).tolist(),
        # Short insular gyri and the anterior circular sulcus. Exclude posterior gyri
        # and the full superior/inferior sulci, which span anterior and posterior insula.
        'insula': np.flatnonzero(np.isin(labels, [18, 48])).tolist(),
        'ec': np.flatnonzero(dk == ec_index).tolist(),
    }
    # mPFC: the HCP-MMP1 pregenual areas between ACC and vmPFC. Regions may overlap; the viewer colors one at a time.
    hcp, _, hcp_names = nib.freesurfer.read_annot(source / f'{h}.HCP-MMP1.annot')
    hcp, hcp_names = hcp[:len(pial)], [name.decode() for name in hcp_names]
    side = 'L' if hemi == 'left' else 'R'
    medial_wall = labels == names.index('Medial_wall')
    masks['mpfc'] = np.flatnonzero(np.isin(hcp, [hcp_names.index(f'{side}_{area}_ROI') for area in ['a24', 'p24', 'p32', 'd32']]) & ~medial_wall).tolist()

    # The matching aseg volume is in voxel coordinates. Convert to surface RAS first,
    # then apply EXACTLY the cortical pial centering/scale, never center HC separately.
    mask = volume == hippocampus_label[hemi]
    voxels = np.argwhere(mask)
    lo = voxels.min(0) - 3
    hi = voxels.max(0) + 4
    cropped = mask[tuple(slice(a, b) for a, b in zip(lo, hi))].astype(float)
    smoothed = gaussian_filter(cropped, sigma=.65)
    hc_vox, hc_faces, _, _ = marching_cubes(smoothed, level=.5, allow_degenerate=False)
    hc_ras = nib.affines.apply_affine(seg.header.get_vox2ras_tkr(), hc_vox + lo)
    # Choose outward winding after extraction and the voxel-to-RAS transformation.
    # Signed enclosed volume accounts for both marching-cubes order and handedness.
    triangles = hc_ras[hc_faces]
    signed_volume = np.sum(triangles[:, 0] * np.cross(triangles[:, 1], triangles[:, 2])) / 6
    if signed_volume < 0:
        hc_faces = hc_faces[:, ::-1]
    hc_vertices = (hc_ras - pial_center) / pial_scale
    assert np.isfinite(hc_vertices).all() and len(hc_vertices) < 65536

    payload = {
        'pial': np.round(centered(pial), 5).ravel().tolist(),
        'faces': faces.ravel().tolist(), 'sulc': np.round(sulc, 3).tolist(),
        'labels': labels.tolist(), 'names': names,
        'masks': masks,
        'hippocampus': {'vertices': np.round(hc_vertices, 5).ravel().tolist(), 'faces': hc_faces.ravel().tolist()},
        # Display coordinates are (surface RAS - center) / scale. The viewer uses this
        # to place both hemispheres in one shared frame.
        'hemisphere': hemi,
        'frame': {'center': [round(float(v), 5) for v in pial_center], 'scale': round(float(pial_scale), 5)},
    }
    filename = f'fsaverage5-{hemi}.json'
    (output / filename).write_text(json.dumps(payload, separators=(',', ':')) + '\n')
    urls = {f'pial_{hemi}.gii.gz': f'{nilearn}/pial_{hemi}.gii.gz', f'sulc_{hemi}.gii.gz': f'{nilearn}/sulc_{hemi}.gii.gz',
            f'{hemi}.aparc.a2009s.annot': destrieux[hemi],
            f'{h}.pial': f'{fsbase}/surf/{h}.pial', f'{h}.aparc.annot': f'{fsbase}/label/{h}.aparc.annot',
            f'{h}.HCP-MMP1.annot': hcp_urls[h]}
    summary = {
        'file': filename, 'vertices': len(pial), 'triangles': len(faces),
        'pial_center_ras': pial_center.tolist(), 'pial_scale': float(pial_scale),
        'masks': {key: len(value) for key, value in masks.items()},
        'hippocampus': {'aseg_label': hippocampus_label[hemi], 'voxels': int(mask.sum()), 'vertices': len(hc_vertices),
                        'triangles': len(hc_faces), 'ras_bounds': [hc_ras.min(0).tolist(), hc_ras.max(0).tolist()]},
        'output_sha256': hashlib.sha256((output / filename).read_bytes()).hexdigest(),
    }
    print(f'Exported {hemi} cortex:', len(pial), 'vertices; HC:', len(hc_vertices), 'vertices; masks:', summary['masks'])
    return summary, urls


hemispheres, urls = {}, {}
for hemi in ['left', 'right']:
    hemispheres[hemi], hemi_urls = export(hemi)
    urls.update(hemi_urls)
urls['aseg.mgz'] = f'{fsbase}/mri/aseg.mgz'


def describe(name, url):
    data = (source / name).read_bytes()
    return {'url': url, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


provenance = {
    'template': 'FreeSurfer fsaverage5, left and right hemispheres',
    'atlas': 'Destrieux 2009 surface atlas; Desikan-Killiany entorhinal parcel; FreeSurfer aseg Left-Hippocampus (17) and Right-Hippocampus (53); mPFC from HCP-MMP1 (Glasser et al. 2016)',
    'nilearn_revision': revision,
    'transform': 'Each hemisphere is centered on its own pial bounding box and uniformly scaled; frame.center and frame.scale in each asset recover surface RAS (= display * scale + center), so the viewer can place both hemispheres together. Hippocampus converted with aseg vox2ras_tkr and the same hemisphere pial transform. Only the folded pial surface is exported; there are no inflated coordinates.',
    'same_template_check': 'Nilearn pial coordinates and topology exactly match the FreeSurfer fsaverage5 reference pial in each hemisphere.',
    'regions': {
        'vmpfc': 'Approximate lower medial prefrontal neighborhood: Destrieux rectus (31), subcallosal (32), medial orbital/olfactory sulcus (64), suborbital sulcus (71), and lower anterior cingulate (6; surface RAS z < 10 mm). Includes medial OFC; not an exclusively orbital label.',
        'acc': 'Anterior cingulate entry: Destrieux anterior midcingulate (7, G_and_S_cingul-Mid-Ant) plus the dorsal part of Destrieux anterior cingulate (6, G_and_S_cingul-Ant): its vertices that Desikan-Killiany labels superiorfrontal or caudalanteriorcingulate. Drops the pregenual/subgenual wrap around the genu (DK rostralanteriorcingulate and medialorbitofrontal). Not presented as the study lesion mask. Regions may overlap; the viewer colors one at a time.',
        'mpfc': 'Medial prefrontal cortex between ACC and vmPFC: HCP-MMP1 (Glasser et al. 2016) pregenual areas a24, p24, p32 and d32 on fsaverage (first 10242 vertices = fsaverage5). Destrieux Medial_wall vertices excluded. Overlaps vmpfc and acc in places.',
        'insula': 'Anterior insula guide: Destrieux short insular gyri (18, G_insular_short) and anterior circular sulcus (48, S_circular_insula_ant). Excludes long insular gyri and the full superior/inferior circular sulci.',
        'ec': 'Dedicated Desikan-Killiany entorhinal parcel (index 6); 48 left and 42 right fsaverage5 vertices; not the whole parahippocampal parcel.',
        'hc': 'Matching fsaverage5 aseg label 17 (Left-Hippocampus) or 53 (Right-Hippocampus). Gaussian sigma 0.65 voxel, marching cubes at 0.5; display smoothing only.',
    },
    'hemispheres': hemispheres,
    'sources': {name: describe(name, url) for name, url in urls.items()},
}
(output / 'provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
(output / 'NILEARN-LICENSE.txt').write_bytes((source / 'NILEARN-LICENSE').read_bytes())
