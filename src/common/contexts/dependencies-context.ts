import { createContext } from 'react'

export type DependenciesContextValue = {
	dependencies: Record<string, object[]>
}

export const DependenciesContext = createContext<DependenciesContextValue>(
	{} as DependenciesContextValue
)
