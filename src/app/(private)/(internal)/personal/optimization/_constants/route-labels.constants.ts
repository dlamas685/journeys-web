import { RouteLabel } from '../_enums'

export const ROUTE_LABELS: Record<RouteLabel, string> = {
	[RouteLabel.ROUTE_LABEL_UNSPECIFIED]: 'No especificado',
	[RouteLabel.DEFAULT_ROUTE]: 'Ruta predeterminada',
	[RouteLabel.DEFAULT_ROUTE_ALTERNATE]: 'Ruta alternativa',
	[RouteLabel.FUEL_EFFICIENT]: 'Ruta eficiente en combustible',
	[RouteLabel.SHORTER_DISTANCE]: 'Ruta con la distancia más corta',
}
