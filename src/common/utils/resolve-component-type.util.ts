export const resolveComponentType = (childType: any) => {
	if (
		typeof childType === 'object' &&
		childType !== null &&
		'$$typeof' in childType &&
		childType.$$typeof === Symbol.for('react.lazy')
	) {
		return childType._init(childType._payload)
	}
	return childType
}
