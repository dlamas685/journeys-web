import { TrafficOption } from '../_enums'

export const ROUTING_PREFERENCES: Record<TrafficOption, string> = {
	TRAFFIC_AWARE: ' Considerar el tráfico',
	TRAFFIC_AWARE_OPTIMAL: 'Considerar el tráfico y optimizar',
	TRAFFIC_UNAWARE: 'No considerar el tráfico',
}
