import React from 'react';
import ColorPicker from './ColorPicker';
import ColorPalette from './ColorPalette';
import FinishSelector from './FinishSelector';

/**
 * Combined customization panel wrapping color + finish selection
 */
const CustomizationPanel = ({
    selectedColor,
    selectedFinish,
    onColorChange,
    onFinishChange,
}) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Selection */}
                <div className="card p-5 space-y-4">
                    <h3 className="text-base font-semibold text-text-primary">
                        Choose Color
                    </h3>
                    <ColorPalette
                        selectedColor={selectedColor}
                        onSelect={onColorChange}
                    />
                    <div className="border-t border-gray-100 pt-4">
                        <ColorPicker value={selectedColor} onChange={onColorChange} />
                    </div>
                </div>

                {/* Finish Selection */}
                <div className="card p-5">
                    <h3 className="text-base font-semibold text-text-primary mb-4">
                        Choose Finish
                    </h3>
                    <FinishSelector
                        selectedFinish={selectedFinish}
                        onSelect={onFinishChange}
                    />
                </div>

            </div>

        </div>
    );
};

export default CustomizationPanel;
