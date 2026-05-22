import { describe, expect, it } from 'vitest'
import {
	createBgWrapper,
	createColorWrapper,
	createGenericWrapper,
	createModifierWrapper,
} from '../../src/common/utils/styling-function.js'

describe('styling-functions', () => {
	it('should wrap string with generic open and close codes', () => {
		const wrapper = createGenericWrapper(10, 20)
		expect(wrapper('(test)')).toBe('\u001B[10m(test)\u001B[20m')
	})

	it('should apply nested wrapper function', () => {
		const innerWrapper = (str: string) => `(${str})`
		const wrapper = createGenericWrapper(10, 20, innerWrapper)
		expect(wrapper('test')).toBe('\u001B[10m(test)\u001B[20m')
	})

	it('should create correct modifier wrapper (bold)', () => {
		const bold = createModifierWrapper('bold')
		expect(bold('(text)')).toBe('\u001B[1m(text)\u001B[22m')
	})

	it('should create correct color wrapper (red)', () => {
		const red = createColorWrapper('red')
		expect(red('(error)')).toBe('\u001B[31m(error)\u001B[39m')
	})

	it('should create correct background wrapper (bgBlue)', () => {
		const bgBlue = createBgWrapper('bgBlue')
		expect(bgBlue('(info)')).toBe('\u001B[44m(info)\u001B[49m')
	})

	it('should handle composition of styles', () => {
		const boldRed = createColorWrapper('red', createModifierWrapper('bold'))
		expect(boldRed('(alert)')).toBe('\u001B[31m\u001B[1m(alert)\u001B[22m\u001B[39m')
	})
})
