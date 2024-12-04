import { FilterRules } from '../enums'

export const TEXT_FILTER_OPTIONS = [
	{
		label: 'Contiene',
		value: FilterRules.CONTAINS,
	},
	{
		label: 'Similar a',
		value: FilterRules.LIKE,
	},
	{
		label: 'Inicia con',
		value: FilterRules.STARTS_WITH,
	},
	{
		label: 'Termina con',
		value: FilterRules.ENDS_WITH,
	},
	{
		label: 'Igual a',
		value: FilterRules.EQUALS,
	},
].sort((a, b) => a.label.localeCompare(b.label))
