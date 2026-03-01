// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const ua = navigator ? navigator.userAgent : undefined;

/** @internal */
export const isChromium = ua ? (ua.includes('Chrome') && !ua.includes('Firefox')) || ua.includes('Edg/') : true;
