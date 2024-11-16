import SkeletonCard from './skeleton-card'

const SkeletonGrid = () => {
	return (
		<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
			{Array.from({ length: 10 }).map((_, index) => (
				<SkeletonCard key={index} />
			))}
		</section>
	)
}

export default SkeletonGrid
