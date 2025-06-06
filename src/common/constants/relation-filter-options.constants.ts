import { FilterRules } from '../enums'

export const RELATION_FILTER_OPTIONS = [
	{
		label: 'Igual a',
		value: FilterRules.EQUALS,
	},
	{
		label: 'Distinto de',
		value: FilterRules.NOT_EQUALS,
	},
].sort((a, b) => a.label.localeCompare(b.label))
