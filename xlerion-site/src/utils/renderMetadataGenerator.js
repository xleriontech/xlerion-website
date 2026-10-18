/**
 * Utility to auto-generate render metadata
 * Generates description, techniques, and other metadata based on filename patterns
 */

export const generateRenderMetadata = (filename) => {
    // Try structured filename parsing first: nombre_descripcion_sw1-sw2_tec1-tec2.ext
    const structured = parseStructuredMetadata(filename);
    const bgColor = filename.toLowerCase().endsWith('.jpg') ? 'black' : 'white';

    if (structured) {
        return {
            ...structured,
            year: new Date().getFullYear().toString(),
            bgColor,
        };
    }

    // Fallback: heuristic generation from base name
    const baseName = filename.replace(/\.[^/.]+$/, '');
    return {
        title: formatTitle(baseName),
        description: generateDescription(baseName),
        software: ["3ds Max", "ZBrush", "Substance 3D Painter"],
        techniques: generateTechniques(baseName),
        year: new Date().getFullYear().toString(),
        bgColor,
    };
};

// Parses filenames like: nombre_descripcion_software1-software2_tecnica1-tecnica2.ext
export const parseStructuredMetadata = (filename) => {
    const base = filename.replace(/\.[^/.]+$/, '');
    const parts = base.split('_');

    // Expect at least 4 sections: name, description, softwares, techniques
    if (parts.length < 4) return null;

    const [rawName, rawDescription, rawSoftwares, rawTechniques] = parts;

    const title = humanizeToken(rawName);
    const description = humanizeToken(rawDescription);
    const software = rawSoftwares
        .split('-')
        .filter(Boolean)
        .map(s => normalizeSoftware(s));
    const techniques = rawTechniques
        .split('-')
        .filter(Boolean)
        .map(t => normalizeTechnique(t));

    return {
        title,
        description,
        software,
        techniques,
    };
};

const formatTitle = (baseName) => {
    // Convert camelCase or snake_case to Title Case
    return baseName
        .replace(/([A-Z])/g, ' $1') // Add space before capitals
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\d+/g, (num) => ` ${num}`) // Add space before numbers
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const generateDescription = (baseName) => {
    const lowerName = baseName.toLowerCase();

    // Pattern-based descriptions
    if (lowerName.includes('xhunter') || lowerName.includes('x-hunter')) {
        const descriptions = [
            'Render de personaje robótico con iluminación dramática',
            'Vista lateral del personaje con detalles mecánicos',
            'Pose dinámica con énfasis en armamento',
            'Encuadre frontal con sistemas de armamento visibles',
            'Render cinematográfico con efectos de luz neon',
            'Detalle de componentes electrónicos y sistemas',
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    if (lowerName.includes('oficina') || lowerName.includes('office')) {
        return 'Diseño de espacio interior con iluminación profesional';
    }

    if (lowerName.includes('servicio') || lowerName.includes('service')) {
        return 'Visualización de infraestructura y servicios técnicos';
    }

    if (lowerName.includes('bioflora') || lowerName.includes('organic')) {
        return 'Render de elementos orgánicos y vegetación';
    }

    if (lowerName.includes('efectos') || lowerName.includes('effects')) {
        return 'Composición con efectos visuales avanzados';
    }

    // Default description
    return `Render profesional de ${formatTitle(baseName).toLowerCase()}`;
};

const generateTechniques = (baseName) => {
    const lowerName = baseName.toLowerCase();

    // Pattern-based techniques
    if (lowerName.includes('xhunter') || lowerName.includes('x-hunter')) {
        const techniquesList = [
            ['PBR Materials', 'Hard Surface Modeling', 'Subsurface Scattering'],
            ['Metallic Workflow', 'Normal Mapping', 'HDRI Lighting'],
            ['Motion Blur', 'Depth of Field', 'Volumetrics'],
            ['Emission Shaders', 'Glass Materials', 'Ambient Occlusion'],
            ['Character Design', 'Retopology', 'UV Unwrapping'],
        ];
        return techniquesList[Math.floor(Math.random() * techniquesList.length)];
    }

    if (lowerName.includes('oficina') || lowerName.includes('office')) {
        return ['Architectural Rendering', 'Interior Lighting', 'Material Accuracy'];
    }

    if (lowerName.includes('servicio') || lowerName.includes('service')) {
        return ['Technical Rendering', 'Infrastructure Design', 'Product Visualization'];
    }

    if (lowerName.includes('bioflora') || lowerName.includes('organic')) {
        return ['Organic Modeling', 'Procedural Texturing', 'Natural Lighting'];
    }

    // Default techniques
    return ['Standard Rendering', 'Material Mapping', 'Lighting Setup'];
};

const toTitleCase = (str) => {
    return str
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const humanizeToken = (str) => {
    if (!str) return '';
    // Replace separators with space
    let s = str.replace(/[\-\.]+/g, ' ');
    // Insert space before capitals in CamelCase (e.g., XlerionSoftwareRender -> Xlerion Software Render)
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Handle sequences like XMLHTTP -> XML HTTP (split between consecutive capitals followed by lowercase)
    s = s.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    // Collapse extra spaces
    s = s.replace(/\s+/g, ' ').trim();
    return toTitleCase(s);
};

const normalizeSoftware = (raw) => {
    const key = raw.replace(/\s|\.|-/g, '').toLowerCase();
    const map = {
        '3dmax': '3ds Max',
        '3dsmax': '3ds Max',
        'vray': 'V-Ray',
        'zbrush': 'ZBrush',
        'substance3dpainter': 'Substance 3D Painter',
        'substances3dpainter': 'Substance 3D Painter',
        'blender': 'Blender',
        'threejs': 'Three.js'
    };
    return map[key] ?? toTitleCase(raw.replace(/\./g, ' ').replace(/-/g, ' '));
};

const normalizeTechnique = (raw) => {
    const key = raw.replace(/\s|\.|-/g, '').toLowerCase();
    const map = {
        'pbr': 'PBR Materials',
        'hardsurface': 'Hard Surface Modeling',
        'dof': 'Depth Of Field',
        'hdrilighting': 'HDRI Lighting'
    };
    return map[key] ?? toTitleCase(raw.replace(/\./g, ' ').replace(/-/g, ' '));
};
