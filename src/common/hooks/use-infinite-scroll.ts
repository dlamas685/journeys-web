import { useCallback, useEffect, useRef, useState } from 'react'
import { findAll } from '../actions/crud.action'
import { ApiEndpoints, Pathnames } from '../enums'
import { QueryParamsModel } from '../models'
import useResponse from './use-response'

type InfiniteScrollOptions<T> = {
	endpoint: ApiEndpoints
	defaultValue: T[]
	page: number
	lastPage: number
	fallbackUrl: Pathnames
	queryParams: QueryParamsModel
}

const useInfiniteScroll = <Model>({
	endpoint,
	defaultValue,
	page,
	lastPage,
	fallbackUrl,
	queryParams,
}: InfiniteScrollOptions<Model>) => {
	const limit = 10
	const [currentPage, setCurrentPage] = useState<number>(page + 1)
	const [records, setRecords] = useState<Model[]>(defaultValue)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [hasMore, setHasMore] = useState<boolean>(page < lastPage)
	const [hasError, setHasError] = useState<boolean>(false)
	const response = useResponse()
	const loader = useRef<HTMLDivElement | null>(null)

	const loadMoreRecords = useCallback(async () => {
		if (hasError) return

		const newQueryParams: QueryParamsModel = {
			...queryParams,
			page: currentPage,
			limit,
		}

		setIsLoading(true)

		await findAll<Model>(endpoint, newQueryParams, fallbackUrl)
			.then(({ data, meta }) => {
				setRecords(prevRecords => [...prevRecords, ...data])
				setCurrentPage(prevPage => prevPage + 1)
				setHasMore(meta.page < meta.lastPage)
			})
			.catch(error => {
				response.error(error)
				setHasError(true)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [hasError, queryParams, currentPage, endpoint, fallbackUrl, response])

	const clearError = () => {
		setHasError(false)
	}

	useEffect(() => {
		const currentLoader = loader.current

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

		if (currentLoader) {
			observer.observe(currentLoader)
		}

		return () => {
			if (currentLoader) {
				observer.unobserve(currentLoader)
			}
		}
	}, [isLoading, loadMoreRecords, hasMore, queryParams])

	useEffect(() => {
		setRecords(defaultValue)
		setCurrentPage(page + 1)
		setHasMore(page < lastPage)
	}, [queryParams, defaultValue, page, lastPage])

	return { records, hasMore, loader, isLoading, hasError, clearError }
}

export default useInfiniteScroll
