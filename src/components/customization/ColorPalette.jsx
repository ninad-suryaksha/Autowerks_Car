import React from 'react';
import { COLOR_PALETTE } from '../../config/colors.config';

/**
 * Grid of predefined automotive colors
 */
const ColorPalette = ({ selectedColor, onSelect }) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">
                Popular Colors
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                {COLOR_PALETTE.map((color) => {
                    const isSelected = selectedColor?.colorHex === color.hex;
                    return (
                        <button
                            key={color.hex}
                            onClick={() => onSelect({ colorName: color.name, colorHex: color.hex })}
                            className={`group relative w-full aspect-square rounded-full transition-all duration-300
                         hover:scale-110 hover:shadow-lg border-2
                         ${isSelected
                                    ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-xl border-white'
                                    : 'border-gray-100 hover:border-gray-300'
                                }`}
                            style={{
                                backgroundColor: color.hex,
                                boxShadow: isSelected ? undefined : 'inset 0 1px 2px rgba(0,0,0,0.05)'
                            }}

                            aria-label={color.name}
                            title={color.name}
                        >
                            {isSelected && (
                                <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold drop-shadow-md">
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorPalette;
