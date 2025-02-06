'use client'
import { ReactNode } from 'react'
import { DependenciesContext } from '../contexts/dependencies-context'

type Props = {
	dependencies: Record<string, object[]>
	children: ReactNode
}

const DependenciesProvider = ({ dependencies, children }: Readonly<Props>) => {
	return (
		<DependenciesContext.Provider value={{ dependencies }}>
			{children}
		</DependenciesContext.Provider>
	)
}

export default DependenciesProvider
