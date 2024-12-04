import { FilterRules } from '../enums'

export const NUMBER_FILTER_OPTIONS = [
	{
		label: 'Igual a',
		value: FilterRules.EQUALS,
	},
	{
		label: 'Mayor a',
		value: FilterRules.GREATER_THAN,
	},
	{
		label: 'Menor a',
		value: FilterRules.LESS_THAN,
	},
	{
		label: 'Mayor o igual a',
		value: FilterRules.GREATER_THAN_OR_EQUALS,
	},
	{
		label: 'Menor o igual a',
		value: FilterRules.LESS_THAN_OR_EQUALS,
	},
].sort((a, b) => a.label.localeCompare(b.label))
