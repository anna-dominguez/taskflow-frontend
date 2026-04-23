import React from 'react';
import type { Task } from '../types';
import { updateTask, deleteTask } from '../api';
import { Check, Trash2, Folder, InboxIcon } from 'lucide-react';

interface TaskListProps {
	tasks: Task[];
	onTaskUpdated: () => void;
	filterCategoryId: number | null;
}

export const TaskList: React.FC<TaskListProps> = ({
	tasks,
	onTaskUpdated,
	filterCategoryId,
}) => {
	const [loadingId, setLoadingId] = React.useState<number | null>(null);

	const handleToggle = async (task: Task) => {
		setLoadingId(task.id);
		try {
			await updateTask(task.id, !task.is_completed);
			onTaskUpdated();
		} catch (error) {
			console.error('Erreur lors de la mise à jour:', error);
			alert('Erreur lors de la mise à jour de la tâche');
		} finally {
			setLoadingId(null);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;

		setLoadingId(id);
		try {
			await deleteTask(id);
			onTaskUpdated();
		} catch (error) {
			console.error('Erreur lors de la suppression:', error);
			alert('Erreur lors de la suppression de la tâche');
		} finally {
			setLoadingId(null);
		}
	};

	const filteredTasks = filterCategoryId
		? tasks.filter((task) => task.category === filterCategoryId)
		: tasks;

	if (filteredTasks.length === 0) {
		return (
			<div className="py-32 text-center">
				<div className="inline-block">
					<InboxIcon className="w-24 h-24 text-gray-300 mx-auto mb-6 animate-bounce" strokeWidth={1.5} />
					<h3 className="text-3xl font-bold text-gray-400 mb-3">
						Aucune tâche pour le moment
					</h3>
					<p className="text-lg text-gray-400">
						Ajoutez votre première tâche pour commencer !
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{filteredTasks.map((task, index) => (
				<div
					key={task.id}
					className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${
						task.is_completed
							? 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
							: 'border-indigo-100 hover:border-indigo-300 hover:-translate-y-1'
					}`}
					style={{
						animationDelay: `${index * 50}ms`,
						animation: 'slideIn 0.3s ease-out forwards',
					}}
				>
					{/* Barre de progression latérale */}
					<div
						className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl transition-all duration-300 ${
							task.is_completed
								? 'bg-gradient-to-b from-green-400 to-emerald-500'
								: 'bg-gradient-to-b from-indigo-400 to-purple-500'
						}`}
					/>

					<div className="flex items-start gap-5 pl-3">
						{/* Checkbox personnalisée */}
						<label className="relative flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform mt-1">
							<input
								type="checkbox"
								checked={task.is_completed}
								onChange={() => handleToggle(task)}
								disabled={loadingId === task.id}
								className="peer sr-only"
							/>
							<div
								className={`w-8 h-8 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
									task.is_completed
										? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500'
										: 'border-gray-300 bg-white peer-hover:border-indigo-400'
								}`}
							>
								{task.is_completed && (
									<Check className="w-6 h-6 text-white" strokeWidth={3} />
								)}
								{loadingId === task.id && (
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
									</div>
								)}
							</div>
						</label>

						{/* Contenu de la tâche */}
						<div className="flex-1 min-w-0">
							<p
								className={`text-lg font-medium mb-3 leading-relaxed transition-all duration-300 ${
									task.is_completed
										? 'line-through text-gray-400'
										: 'text-gray-800'
								}`}
							>
								{task.description}
							</p>
							<div className="flex items-center gap-3 flex-wrap">
								<span
									className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
										task.is_completed
											? 'bg-gray-200 text-gray-500'
											: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
									}`}
								>
									<Folder className="w-4 h-4" strokeWidth={2} />
									<span>{task.category_name}</span>
								</span>
								<span className="text-sm text-gray-400 font-medium">
									{new Date(task.created_at).toLocaleDateString('fr-FR', {
										day: 'numeric',
										month: 'short',
										year: 'numeric',
									})}
								</span>
							</div>
						</div>

						{/* Bouton de suppression */}
						<button
							type="button"
							onClick={() => handleDelete(task.id)}
							disabled={loadingId === task.id}
							className="opacity-0 group-hover:opacity-100 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
							title="Supprimer la tâche"
						>
							<Trash2 className="w-6 h-6 text-red-500" />
						</button>
					</div>
				</div>
			))}

			<style>{`
				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
};
