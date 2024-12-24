import { Context, useContext } from 'react'
import {
	TodoListContext,
	type TodoListContextValue,
} from '../_context/todo-list.context'

export const useTodoListContext = () => {
	const context = useContext(
		TodoListContext as Context<TodoListContextValue | null>
	)
	if (!context) {
		throw new Error(
			'useTodoListContext debe ser usado dentro de un TodoListContext'
		)
	}
	return context
}
