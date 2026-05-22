// eslint-disable-next-line ts/no-unnecessary-condition
const ua = globalThis.navigator ? globalThis.navigator.userAgent : undefined

/** @internal */
export const isChromium = ua ? (ua.includes('Chrome') && !ua.includes('Firefox')) || ua.includes('Edg/') : false
