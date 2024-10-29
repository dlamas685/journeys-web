import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { findAll } from '../actions/crud.action'
import { ApiEndpoints, Pathnames } from '../enums'
import { QueryParamsModel } from '../models'
import { decodeQuery } from '../utils'
import useResponse from './use-response'

type PaginationOptions<T> = {
	endpoint: ApiEndpoints
	defaultValue: T[]
	page: number
	lastPage: number
	entity?: string
	redirectUrl: Pathnames
}

const useInfiniteScroll = <Model>({
	endpoint,
	defaultValue,
	page,
	lastPage,
	redirectUrl,
	entity = 'registros',
}: PaginationOptions<Model>) => {
	console.log(page, lastPage)

	const limit = 10
	const [currentPage, setCurrentPage] = useState<number>(page + 1)
	const [records, setRecords] = useState<Model[]>(defaultValue)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [hasMore, setHasMore] = useState<boolean>(page < lastPage)
	const response = useResponse()
	const loader = useRef<HTMLDivElement | null>(null)
	const searchParams = useSearchParams()
	const router = useRouter()

	const loadMoreRecords = useCallback(async () => {
		if (isLoading || !hasMore) return

		const encodedQuery = searchParams.get('query') ?? ''

		let queryParams: QueryParamsModel = {
			page: currentPage,
			limit,
		}

		if (encodedQuery) {
			const decodedQuery = decodeQuery(encodedQuery)

			if (!decodedQuery) {
				router.push(redirectUrl)
				return
			}

			queryParams = {
				...decodedQuery,
				...queryParams,
			}
		}

		setIsLoading(true)

		await findAll<Model>(endpoint, queryParams, redirectUrl)
			.then(({ data, meta }) => {
				setRecords(prevRecords => [...prevRecords, ...data])
				setCurrentPage(prevPage => prevPage + 1)
				setHasMore(meta.page < meta.lastPage)
			})
			.catch(response.error)
			.finally(() => {
				setIsLoading(false)
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, currentPage, hasMore])

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: '20px',
			threshold: 1.0,
		}

		const observer = new IntersectionObserver(entries => {
			const target = entries[0]
			if (target.isIntersecting && !isLoading && hasMore) {
				loadMoreRecords()
			}
		}, options)

		if (loader.current) {
			observer.observe(loader.current)
		}

		return () => {
			if (loader.current) {
				observer.unobserve(loader.current)
			}
		}
	}, [isLoading, loadMoreRecords, hasMore])

	return { records, hasMore, loader, isLoading }
}

export default useInfiniteScroll
