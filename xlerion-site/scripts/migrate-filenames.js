#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const imagesDir = path.join(root, 'public', 'images', 'renders');
const configPath = path.join(root, 'src', 'data', 'rendersConfig.json');

const normalizeSoftwareToken = (name) => {
    const key = name.replace(/\s|\.|-/g, '').toLowerCase();
    const map = {
        '3dsmax': '3DMax',
        '3dmax': '3DMax',
        'vray': 'Vray',
        'zbrush': 'ZBrush',
        'substance3dpainter': 'Substance3DPainter',
        'substances3dpainter': 'Substance3DPainter',
        'blender': 'Blender',
    };
    return map[key] ?? name.replace(/[^a-zA-Z0-9]+/g, '').replace(/^(.)/, (m) => m.toUpperCase());
};

const normalizeTechniqueToken = (tech) => {
    const key = tech.replace(/\s|\.|-/g, '').toLowerCase();
    const map = {
        'pbrmaterials': 'PBR',
        'pbr': 'PBR',
        'hardsurfacemodeling': 'HardSurface',
        'hardsurface': 'HardSurface',
        'depthoffield': 'DOF',
        'dof': 'DOF',
        'hdrilighting': 'HDRILighting',
        'professionalighting': 'ProfessionalLighting',
    };
    return map[key] ?? tech.replace(/[^a-zA-Z0-9]+/g, '').replace(/^(.)/, (m) => m.toUpperCase());
};

const toPascal = (str, maxWords = 4) => {
    return str
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .slice(0, maxWords)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
};

const proposeFilename = (entry) => {
    const ext = path.extname(entry.filename || '').toLowerCase() || '.jpg';
    const name = toPascal(entry.title || 'Render');
    const desc = toPascal(entry.description || 'Detalle', 5);
    const software = Array.isArray(entry.software) && entry.software.length > 0
        ? entry.software.map(normalizeSoftwareToken).join('-')
        : '3DMax-ZBrush-Substance3DPainter';
    const techniques = Array.isArray(entry.techniques) && entry.techniques.length > 0
        ? entry.techniques.map(normalizeTechniqueToken).join('-')
        : 'PBR-HardSurface';
    return `${name}_${desc}_${software}_${techniques}${ext}`;
};

const main = () => {
    const apply = process.argv.includes('--apply');
    const backup = process.argv.includes('--backup');

    if (!fs.existsSync(configPath)) {
        console.error('rendersConfig.json not found:', configPath);
        process.exit(1);
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!Array.isArray(config.renders)) {
        console.error('Invalid config: missing renders array');
        process.exit(1);
    }

    if (!fs.existsSync(imagesDir)) {
        console.error('Images directory not found:', imagesDir);
        process.exit(1);
    }

    const updates = [];
    for (const entry of config.renders) {
        const oldName = entry.filename;
        const newName = proposeFilename(entry);
        if (oldName === newName) continue;

        const oldPath = path.join(imagesDir, oldName);
        const newPath = path.join(imagesDir, newName);

        updates.push({ id: entry.id, oldName, newName, oldPath, newPath });
    }

    // Show plan
    console.log('Proposed migrations (count =', updates.length, '):');
    for (const u of updates) {
        console.log(`  [${u.id}] ${u.oldName} -> ${u.newName}`);
    }

    if (backup) {
        const backupPath = path.join(path.dirname(configPath), `rendersConfig.backup.${Date.now()}.json`);
        fs.writeFileSync(backupPath, JSON.stringify(config, null, 2));
        console.log('Backup saved to', backupPath);
    }

    if (apply) {
        // Rename files when source exists
        for (const u of updates) {
            if (!fs.existsSync(u.oldPath)) {
                console.warn('Source missing, skip:', u.oldName);
                continue;
            }
            try {
                fs.renameSync(u.oldPath, u.newPath);
                console.log('Renamed:', u.oldName, '->', u.newName);
            } catch (e) {
                console.error('Rename failed:', u.oldName, e.message);
            }
        }

        // Update config filenames
        for (const entry of config.renders) {
            const upd = updates.find((u) => u.id === entry.id);
            if (upd) entry.filename = upd.newName;
        }
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log('Updated config:', configPath);
    } else {
        console.log('Dry run complete. Use --apply to perform migration.');
    }
};

main();
