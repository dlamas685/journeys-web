import { TrafficModel } from '../_enums'

export const TRAFFIC_MODELS: Record<TrafficModel, string> = {
	BEST_GUESS: 'Mejor estimación',
	PESSIMISTIC: 'Pesimista',
	OPTIMISTIC: 'Optimista',
}
