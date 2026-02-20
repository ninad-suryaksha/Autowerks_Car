import React from 'react';

/**
 * Hex color picker with live swatch preview
 */
const ColorPicker = ({ value, onChange }) => {
    const handleHexChange = (e) => {
        const hex = e.target.value;
        onChange({ colorName: hex, colorHex: hex });
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">
                Custom Color
            </label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value?.colorHex || '#007AFF'}
                    onChange={handleHexChange}
                    className="w-12 h-12 rounded-xl border-2 border-gray-100 cursor-pointer 
                     appearance-none bg-transparent p-0.5 shadow-sm transition-all hover:border-gray-300"
                    style={{
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                    }}
                />

                <input
                    type="text"
                    value={value?.colorHex || ''}
                    onChange={handleHexChange}
                    placeholder="#FF2800"
                    className="input-field max-w-[140px] font-mono text-sm"
                />
            </div>
        </div>
    );
};

export default ColorPicker;
