import masterTemplate from './masterTemplate.json';
import videoTemplate from './videoTemplate.json';
import { FINISH_DESCRIPTIONS } from './finishDescriptions';

/**
 * Build the text prompt for Nano Banana image generation
 * @param {{ colorName: string, colorHex?: string, colorDescription?: string }} color
 * @param {string} finishType - 'glossy' | 'matte' | 'satin'
 * @returns {string} Constructed prompt
 */
export const buildFourImagePrompts = (color, finishType) => {
    const colorString = color.colorHex
        ? `${color.colorName} (${color.colorHex})`
        : color.colorDescription || color.colorName;

    const finish = finishType || 'glossy';

    const baseConstraint = `
Hard constraints (do NOT change):
- Keep the car's model, body kit, wheels, brake calipers, badges, grille, glass, lights, mirrors, and number plate exactly the same as in the uploaded image.
- Do not change the car's proportions, design details, or add/remove any parts.
- No people, no extra props, no environment other than studio, ramp, and subtle floor reflections.
- Only change: background to studio ramp scene and body color/finish as specified, everything else stays identical.`;

    const getFinishInstructions = (finishType, orientation) => {
        if (finishType === 'matte') {
            if (orientation === 'front') return '- If matte finish: reduce specular highlights, keep smooth, diffused reflections.';
            if (orientation === 'left') return '- If matte finish: keep low-gloss, diffused reflections with clear shape definition.';
            if (orientation === 'right') return '- If matte finish: subdued reflections, clear contour shaping through light falloff.';
            if (orientation === 'rear') return '- If matte finish: soft, even highlights, rich color, minimal sharp reflections.';
        } else if (finishType === 'glossy') {
            if (orientation === 'front') return '- If glossy finish: strong, crisp reflections and highlight strips along the body.';
            if (orientation === 'left') return '- If glossy finish: strong, continuous highlight strips along the side panels, realistic reflections on windows.';
            if (orientation === 'right') return '- If glossy finish: bright, precise specular highlights along doors, fenders, and hood, with realistic reflections of the studio lights.';
            if (orientation === 'rear') return '- If glossy finish: punchy reflections, bright highlights on edges and curves, realistic light strips across the rear.';
        } else { // satin
            if (orientation === 'front') return '- If satin finish: balanced, silky reflections, between matte and gloss.';
            if (orientation === 'left') return '- If satin finish: soft but noticeable sheen on the panels, between matte and gloss.';
            if (orientation === 'right') return '- If satin finish: smooth, velvety sheen; no extreme shine, but clearly reflective.';
            if (orientation === 'rear') return '- If satin finish: smooth, controlled reflections with a premium sheen, between matte and gloss.';
        }
        return '';
    };

    const frontPrompt = `FRONT VIEW – STUDIO RAMP SHOT

Edit the uploaded photo(s) of this exact car using high-precision photo editing.
Place this same car on a clean, modern showroom ramp in a dark, premium studio environment.

Wrap and finish:
- Wrap color: ${colorString}
- Finish type: ${finish}

Scene and camera:
- View: perfectly centered front view of the same car, hero shot, slightly low camera angle like a car commercial.
- Background: seamless dark studio with a subtle gradient wall, no clutter, no logos, no text.
- Ramp: sleek, slightly elevated circular or rectangular ramp under the car, with soft reflections on its surface, car aligned straight and fully on the ramp.

Lighting:
- High-end car showroom lighting with multiple softbox lights from above and 45 degrees to each side, plus a gentle rim light from behind to separate the car from the background.
- Emphasize the curves and body lines of the car with soft, controlled reflections across the wrap.${getFinishInstructions(finish, 'front')}
- Avoid overexposed flares or blown-out highlights.
${baseConstraint}
Output:
- Ultra-realistic front studio shot of the exact same car on a showroom ramp, with the specified wrap color and finish, beautifully lit like a premium car showcase.`;

    const leftPrompt = `LEFT SIDE VIEW – STUDIO RAMP SHOT

Edit the uploaded photo(s) of this exact car.
Place this same car on a clean, modern showroom ramp in a dark, premium studio environment.

Wrap and finish:
- Wrap color: ${colorString}
- Finish type: ${finish}

Scene and camera:
- View: full left side profile of the same car, wheels visible, slight 3/4 angle from the front left so the side and a bit of the front are visible.
- Background: seamless dark studio with a soft gradient, no text or branding.
- Ramp: sleek, slightly elevated ramp under the car, following the length of the car; ensure the entire car is properly on the ramp, with natural contact shadows.

Lighting:
- Professional showroom lighting: main softbox light above and slightly in front of the car on the left, secondary softbox on the right as fill, subtle back rim light along the roofline and rear.
- Make the side of the car read clearly with long, smooth light bands reflecting across the doors and fenders.${getFinishInstructions(finish, 'left')}
- Keep shadows soft and realistic, not too harsh.
${baseConstraint}
Output:
- Ultra-realistic left side studio ramp shot of the exact same car, with the specified wrap color and finish, lit like a high-end car showcase.`;

    const rightPrompt = `RIGHT SIDE VIEW – STUDIO RAMP SHOT

Edit the uploaded photo(s) of this exact car.
Place this same car on a clean, modern showroom ramp in a dark, cinematic studio.

Wrap and finish:
- Wrap color: ${colorString}
- Finish type: ${finish}

Scene and camera:
- View: full right side profile of the same car, slight 3/4 angle from the front right so the side and a bit of the front are visible.
- Background: minimal dark studio with a soft gradient or vignette, no logos, no text, no clutter.
- Ramp: polished ramp aligned with the car, the car fully on the ramp with accurate contact shadows and a soft reflection underneath.

Lighting:
- High-end studio lighting: key light from above front-right at about 45 degrees, large softbox creating clean reflections along the hood and side.
- Fill light from the opposite side to keep details visible without flattening contrast, plus a subtle back light to outline the roof and rear.${getFinishInstructions(finish, 'right')}
- Preserve physically accurate shadows and avoid unnatural glow effects.
${baseConstraint}
Output:
- Ultra-realistic right side studio ramp shot of the exact same car, in the specified wrap color and finish, with premium showroom lighting.`;

    const rearPrompt = `REAR VIEW – STUDIO RAMP SHOT

Edit the uploaded photo(s) of this exact car.
Place this same car on a clean, modern showroom ramp in a high-end studio.

Wrap and finish:
- Wrap color: ${colorString}
- Finish type: ${finish}

Scene and camera:
- View: centered rear view of the same car, slightly low angle so the rear looks powerful and hero-like.
- Background: dark, minimal studio with a smooth gradient wall, no distractions.
- Ramp: elevated ramp under the car, neatly aligned, with realistic contact shadows and a subtle reflected silhouette of the rear.

Lighting:
- Studio lighting focused on the rear: main softbox from above and slightly behind, creating clean highlights on the trunk, bumper, and rear fenders.
- Two side lights at 45 degrees to emphasize the rear corners and taillight shapes, plus a low front fill to keep the diffuser and lower bumper visible.${getFinishInstructions(finish, 'rear')}
- Keep lighting realistic, with good contrast but no blown-out areas.
${baseConstraint}
Output:
- Ultra-realistic rear studio ramp shot of the exact same car, in the specified wrap color and finish, lit like a professional car showcase.`;

    return [frontPrompt, leftPrompt, rightPrompt, rearPrompt];
};

/**
 * Build the text prompt for Veo 3.1 video generation
 * Uses videoTemplate.json for scene configuration
 * @param {{ colorName: string, colorHex?: string }} color
 * @param {string} finishType
 * @returns {string} Constructed video prompt (plain text for Veo 3.1)
 */
export const buildVideoPrompt = (color, finishType) => {
    const colorString = color.colorHex
        ? `${color.colorName} (${color.colorHex})`
        : color.colorName;

    const normalizedFinish = finishType || 'glossy';
    const finishDescription = FINISH_DESCRIPTIONS[normalizedFinish];

    // Use videoTemplate settings for scene configuration
    const scene = videoTemplate.scene_description;
    const camDir = videoTemplate.camera_movement.direction;
    const camSpeed = videoTemplate.camera_movement.speed.replace(/_/g, ' ');
    const camDuration = videoTemplate.camera_movement.duration.replace(/_/g, ' ');
    const platform = videoTemplate.platform.material.replace(/_/g, ' ');
    const lighting = videoTemplate.lighting.setup.replace(/_/g, ' ');

    // Build a clean narrative prompt — this is what Veo 3.1 expects
    return [
        `Cinematic ${camDir} 360-degree orbit video of a car on a turntable platform.`,
        `The car is placed in a ${scene} on a ${platform} rotating platform.`,
        `Studio lighting: ${lighting} with soft diffused quality that highlights all body contours and paint details.`,
        `Car identity: Reconstruct this exact vehicle with 100% accuracy from the reference images. Maintain the precise make, model, trim, body kit, wheels, and all details.`,
        `Body color: ${colorString}. Finish: ${normalizedFinish} — ${finishDescription}.`,
        `The paint finish must be perfectly represented with realistic light behavior, reflections, and surface characteristics matching a real ${normalizedFinish} finish.`,
        `Camera: Smooth, continuous 360-degree ${camDir} orbit around the car over ${camDuration}.`,
        `Start from a 3/4 front angle. Frame the car perfectly centered throughout the entire rotation.`,
        `Complete the full circle within the duration. Professional, photorealistic 360-spin showcase result.`,
        `No text overlays, no watermarks, no extra objects. Silent video, no audio.`,
    ].join(' ');
};
