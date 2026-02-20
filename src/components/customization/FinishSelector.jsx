import React from 'react';
import { FINISH_TYPES } from '../../config/finishes.config';

/**
 * Card-based finish type selector (glossy, matte, satin)
 */
const FinishSelector = ({ selectedFinish, onSelect }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {FINISH_TYPES.map((finish) => {
                    const isSelected = selectedFinish === finish.id;
                    return (
                        <button
                            key={finish.id}
                            onClick={() => onSelect(isSelected ? null : finish.id)}
                            className={`group relative text-center transition-all duration-500 rounded-3xl p-4 flex flex-col items-center justify-between gap-3 border-2 min-h-[130px]
                         ${isSelected
                                    ? 'bg-white border-blue-500 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] scale-[1.02] z-10'
                                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            {/* Visual Swatch */}
                            <div
                                className={`w-12 h-12 rounded-xl transition-all duration-500 shadow-sm group-hover:rotate-12 ${isSelected ? 'scale-110 rotate-6 shadow-md' : 'scale-100'}`}
                                style={finish.swatchStyle}
                            />

                            <div className="space-y-1">
                                <h3 className={`font-bold text-xs tracking-widest uppercase transition-colors duration-300 ${isSelected ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-500'}`}>
                                    {finish.name}
                                </h3>
                                <p className={`text-[10px] leading-tight text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 max-w-[100px]`}>
                                    {finish.description}
                                </p>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


export default FinishSelector;
