const ua = navigator.userAgent;

/** @internal */
export const isChromium = (ua.includes('Chrome') && !ua.includes('Firefox')) || ua.includes('Edg/');
