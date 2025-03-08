import { RoadmapStatus } from '../_enums/roadmap-status.enum'

export const VALID_TRANSITIONS: Record<RoadmapStatus, RoadmapStatus[]> = {
	UPCOMING: [
		RoadmapStatus.UPCOMING,
		RoadmapStatus.ONGOING,
		RoadmapStatus.DISMISSED,
	],
	ONGOING: [
		RoadmapStatus.ONGOING,
		RoadmapStatus.COMPLETED,
		RoadmapStatus.DISMISSED,
	],
	COMPLETED: [RoadmapStatus.COMPLETED, RoadmapStatus.DISMISSED],
	DISMISSED: [RoadmapStatus.DISMISSED],
}
