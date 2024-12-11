import { cn } from '@/lib/utils'
import { type ComponentProps } from 'react'

type DataTableHeader = ComponentProps<'header'> & {}

const DataTableHeader = ({ className, ...rest }: Readonly<DataTableHeader>) => {
	return (
		<header
			className={cn('grid w-full grid-cols-1 gap-3 sm:grid-cols-2', className)}
			{...rest}
		/>
	)
}

type DataTableToolbar = ComponentProps<'section'> & {}

const DataTableToolbar = ({
	className,
	...rest
}: Readonly<DataTableToolbar>) => {
	return (
		<section
			className={cn(
				'flex flex-wrap items-center gap-2 sm:justify-end',
				className
			)}
			{...rest}
		/>
	)
}

type DataTableBody = ComponentProps<'section'> & {}

const DataTableBody = ({ className, ...rest }: Readonly<DataTableBody>) => {
	return <section className={cn('w-full flex-grow', className)} {...rest} />
}

type DataTableFooter = ComponentProps<'footer'> & {}

const DataTableFooter = ({ className, ...rest }: Readonly<DataTableFooter>) => {
	return (
		<footer
			className={cn(
				'grid w-full grid-cols-1 items-center justify-center gap-3 sm:grid-cols-2',
				className
			)}
			{...rest}
		/>
	)
}

export { DataTableBody, DataTableFooter, DataTableHeader, DataTableToolbar }
