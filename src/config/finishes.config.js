export const FINISH_TYPES = [
    {
        id: 'glossy',
        name: 'Glossy',
        description: 'High-shine, reflective surface with mirror-like quality',
        icon: '✨',
        swatchStyle: {
            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 12px rgba(0,0,0,0.1)',
        }
    },
    {
        id: 'matte',
        name: 'Matte',
        description: 'Flat, non-reflective finish with a premium chalky appearance',
        icon: '🌑',
        swatchStyle: {
            background: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)',
        }
    },
    {
        id: 'satin',
        name: 'Satin',
        description: 'Semi-gloss with subtle, elegant sheen between matte and glossy',
        icon: '🌤',
        swatchStyle: {
            background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
        }
    },

];
