import type React from 'react';
import { useState } from 'react';
import type { Category } from '../types';
import { createTask } from '../api';
import { ChevronDown, FileText, AlertCircle, Lightbulb, Plus } from 'lucide-react';

interface TaskFormProps {
	categories: Category[];
	onTaskAdded: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
	categories,
	onTaskAdded,
}) => {
	const [description, setDescription] = useState('');
	const [categoryId, setCategoryId] = useState<number | ''>('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{
		description?: string;
		category?: string;
	}>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: { description?: string; category?: string } = {};
		if (!description.trim())
			newErrors.description = 'La description est requise';
		if (!categoryId) newErrors.category = 'Veuillez sélectionner une catégorie';

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);
		setErrors({});

		try {
			await createTask(description, categoryId as number);
			setDescription('');
			setCategoryId('');
			onTaskAdded();
		} catch (err: any) {
			setErrors({
				description: err.description?.[0],
				category: err.category?.[0],
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-10 mb-10 border-2 border-indigo-100 shadow-inner"
			onSubmit={handleSubmit}
		>
			<div className="flex items-center gap-4 mb-8">
				<FileText className="w-9 h-9 text-indigo-600" strokeWidth={2} />
				<h3 className="text-gray-800 text-3xl font-bold">Nouvelle Tâche</h3>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-base font-bold text-gray-700 mb-3">
						Description
					</label>
					<div className="relative">
						<textarea
							placeholder="Ex: Préparer la présentation pour la réunion..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							disabled={loading}
							rows={4}
							className={`w-full px-6 py-5 bg-white border-2 rounded-xl text-base resize-none transition-all duration-200 focus:outline-none focus:shadow-lg disabled:bg-gray-50 disabled:cursor-not-allowed placeholder:text-gray-400 ${
								errors.description
									? 'border-red-300 focus:border-red-500'
									: 'border-gray-200 focus:border-indigo-500'
							}`}
						/>
						{description && (
							<div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded">
								{description.length} caractères
							</div>
						)}
					</div>
					{errors.description && (
						<p className="mt-3 text-red-600 text-sm font-medium flex items-center gap-2">
							<AlertCircle className="w-4 h-4" />
							<span>{errors.description}</span>
						</p>
					)}
				</div>

				<div>
					<label className="block text-base font-bold text-gray-700 mb-3">
						Catégorie
					</label>
					<div className="relative">
						<select
							value={categoryId}
							onChange={(e) => setCategoryId(Number(e.target.value))}
							disabled={loading || categories.length === 0}
							className={`w-full px-6 py-5 bg-white border-2 rounded-xl text-base font-medium appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:shadow-lg disabled:bg-gray-50 disabled:cursor-not-allowed ${
								errors.category
									? 'border-red-300 focus:border-red-500'
									: 'border-gray-200 focus:border-indigo-500'
							}`}
						>
							<option value="">Sélectionnez une catégorie...</option>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.name} ({cat.tasks_count} tâche
									{cat.tasks_count > 1 ? 's' : ''})
								</option>
							))}
						</select>
						<div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
							<ChevronDown className="w-6 h-6 text-gray-400" />
						</div>
					</div>
					{errors.category && (
						<p className="mt-3 text-red-600 text-sm font-medium flex items-center gap-2">
							<AlertCircle className="w-4 h-4" />
							<span>{errors.category}</span>
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={loading || categories.length === 0}
					className="w-full py-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
				>
					{loading ? (
						<span className="flex items-center justify-center gap-4">
							<div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
							<span>Ajout en cours...</span>
						</span>
					) : (
						<span className="flex items-center justify-center gap-4">
							<Plus className="w-6 h-6" strokeWidth={2.5} />
							<span>Ajouter la tâche</span>
						</span>
					)}
				</button>

				{categories.length === 0 && (
					<div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
						<div className="flex items-start gap-4">
							<Lightbulb className="w-7 h-7 text-blue-600 flex-shrink-0" />
							<div>
								<p className="text-blue-900 font-bold mb-2 text-base">
									Aucune catégorie disponible
								</p>
								<p className="text-blue-700 text-sm">
									Créez d'abord une catégorie pour organiser vos tâches
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</form>
	);
};
