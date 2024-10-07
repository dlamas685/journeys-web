const PasswordChangeInfo = () => {
	return (
		<section className='flex flex-col gap-3'>
			<h4 className='font-secondary font-medium text-gray-500'>
				Requerimientos
			</h4>
			<ul
				role='list'
				className='list-disc space-y-3 pl-5 text-sm text-gray-500 marker:text-orange-500'>
				<li>Debe tener al menos 8 caracteres.</li>
				<li>Debe contener al menos una letra mayúscula y una minúscula.</li>
				<li>Debe contener al menos un número o un carácter especial.</li>
			</ul>

			<h4 className='font-secondary font-medium text-gray-500'>
				Recomendaciones
			</h4>

			<ul
				role='list'
				className='list-disc space-y-3 pl-5 text-sm text-gray-500 marker:text-orange-500'>
				<li>No uses la misma contraseña de varios sitios</li>
				<li>
					No uses palabras comunes o información personal como tu nombre, fecha
					de nacimiento, etc.
				</li>
			</ul>
		</section>
	)
}

export default PasswordChangeInfo
