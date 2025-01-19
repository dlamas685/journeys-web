import { ExtraComputation } from '../_enums'

export const EXTRA_COMPUTATIONS: Record<ExtraComputation, string> = {
	TOLLS: 'Costos de peaje en la ruta',
	FUEL_CONSUMPTION: 'Consumo estimado de combustible',
	FLYOVER_INFO_ON_POLYLINE: 'Pasos elevados en la ruta',
	TRAFFIC_ON_POLYLINE: 'Tráfico en tiempo real en la ruta',
	HTML_FORMATTED_NAVIGATION_INSTRUCTIONS: 'Instrucciones de navegación',
	NARROW_ROAD_INFO_ON_POLYLINE: 'Caminos estrechos',
}
