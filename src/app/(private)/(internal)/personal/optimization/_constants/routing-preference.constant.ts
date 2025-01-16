import { RoutingPreference } from '../_enums'

export const ROUTING_PREFERENCES: Record<
	keyof typeof RoutingPreference,
	string
> = {
	ROUTING_PREFERENCE_UNSPECIFIED: 'No especificado',
	TRAFFIC_AWARE: ' Considerar el tráfico',
	TRAFFIC_AWARE_OPTIMAL: 'Considerar el tráfico y optimizar',
	TRAFFIC_UNAWARE: 'No considerar el tráfico',
}
