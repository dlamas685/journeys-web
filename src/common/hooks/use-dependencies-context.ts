import { Context, useContext } from 'react'
import {
	DependenciesContext,
	DependenciesContextValue,
} from '../contexts/dependencies-context'

export const useDependenciesContext = () => {
	const context = useContext(
		DependenciesContext as Context<DependenciesContextValue>
	)
	if (!context) {
		throw new Error(
			'useDependenciesContext debe ser usado dentro de un DependenciesProvider'
		)
	}
	return context
}
