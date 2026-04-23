import type { Category, Task } from './types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const API_URL = `${BASE_URL}/api`;

// Gestion des erreurs API
const handleApiError = async (response: Response): Promise<never> => {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw errorData;
	}
	throw new Error('Une erreur est survenue');
};

// Categories API
export const fetchCategories = async (): Promise<Category[]> => {
	const response = await fetch(`${API_URL}/categories/`);
	if (!response.ok) await handleApiError(response);
	return response.json();
};

export const createCategory = async (name: string): Promise<Category> => {
	const response = await fetch(`${API_URL}/categories/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	if (!response.ok) await handleApiError(response);
	return response.json();
};

// Tasks API
export const fetchTasks = async (categoryId?: number): Promise<Task[]> => {
	const url = categoryId
		? `${API_URL}/tasks/?category_id=${categoryId}`
		: `${API_URL}/tasks/`;
	const response = await fetch(url);
	if (!response.ok) await handleApiError(response);
	return response.json();
};

export const createTask = async (
	description: string,
	categoryId: number,
): Promise<Task> => {
	const response = await fetch(`${API_URL}/tasks/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ description, category: categoryId }),
	});
	if (!response.ok) await handleApiError(response);
	return response.json();
};

export const updateTask = async (
	id: number,
	isCompleted: boolean,
): Promise<Task> => {
	const response = await fetch(`${API_URL}/tasks/${id}/`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ is_completed: isCompleted }),
	});
	if (!response.ok) await handleApiError(response);
	return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
	const response = await fetch(`${API_URL}/tasks/${id}/`, {
		method: 'DELETE',
	});
	if (!response.ok) await handleApiError(response);
};
