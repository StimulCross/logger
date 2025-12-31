const ua = navigator.userAgent;

export const isChromium = (ua.includes('Chrome') && !ua.includes('Firefox')) || ua.includes('Edg/');
