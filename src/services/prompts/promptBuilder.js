import masterTemplate from './masterTemplate.json';
import videoTemplate from './videoTemplate.json';
import { FINISH_DESCRIPTIONS } from './finishDescriptions';

/**
 * Build the text prompt for Nano Banana image generation
 * @param {{ colorName: string, colorHex?: string, colorDescription?: string }} color
 * @param {string} finishType - 'glossy' | 'matte' | 'satin'
 * @returns {string} Constructed prompt
 */
export const buildImagePrompt = (color, finishType) => {
    const colorString = color.colorHex
        ? `${color.colorName} (${color.colorHex})`
        : color.colorDescription || color.colorName;

    return `Edit the uploaded photo of the car using high‑precision photo editing.
Apply a full-body vinyl wrap to this exact car in the following style:

Wrap color: ${colorString}

Finish type (choose one): [matte / glossy / satin] — use: ${finishType || 'glossy'}

Rendering instructions:

The new wrap color must cover all painted body panels of the car while perfectly following the existing reflections, shadows, and body lines so it looks like a real vinyl wrap in a professional studio photo.

If the finish is matte, reduce sharp reflections and make the surface softly diffused while still showing subtle light gradients.

If the finish is glossy, keep strong, crisp reflections and highlights on the body, windows, and chrome while matching the original lighting direction.

If the finish is satin, keep soft, smooth reflections with a gentle sheen between matte and gloss, preserving all curvature and contours of the body.

Hard constraints (do NOT change):

Keep the car's model, body kit, wheels, brake calipers, badges, glass, lights, number plate, and all accessories exactly the same as in the uploaded image.

Do not change the background, location, camera angle, composition, or framing.

Do not alter the lighting direction, time of day, or overall mood; only adapt reflections so the new wrap looks realistic.

No changes to people, buildings, road, environment, sky, or any other objects in the scene.

No added text, logos, stickers, textures, graphics, or patterns on the car; just a clean solid-color wrap in the specified finish.

Output:

A single ultra‑realistic photo of the same car from the same perspective, with only the body color changed to the specified wrap color and finish, everything else perfectly preserved.`;
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
