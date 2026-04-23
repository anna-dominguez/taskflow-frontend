import type React from 'react';
import { useState } from 'react';
import { createCategory } from '../api';
import { Plus, X, AlertCircle } from 'lucide-react';

interface CategoryFormProps {
	onCategoryAdded: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
	onCategoryAdded,
}) => {
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError('Le nom de la catégorie est requis');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await createCategory(name);
			setName('');
			onCategoryAdded();
		} catch (err: any) {
			setError(err.name?.[0] || 'Erreur lors de la création de la catégorie');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="backdrop-blur-md bg-white/95 rounded-3xl p-8 shadow-2xl border border-white/50"
			onSubmit={handleSubmit}
		>
			<div className="flex items-center gap-3 mb-6">
				<Plus className="w-7 h-7 text-indigo-600" strokeWidth={2} />
				<h3 className="text-gray-800 text-2xl font-bold">Nouvelle Catégorie</h3>
			</div>
			<div className="space-y-4">
				<div className="relative">
					<input
						type="text"
						placeholder="Ex: Travail, Personnel, Sport..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={loading}
						className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400"
					/>
					{name && (
						<button
							type="button"
							onClick={() => setName('')}
							className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					)}
				</div>
				<button
					type="submit"
					disabled={loading || !name.trim()}
					className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
				>
					{loading ? (
						<span className="flex items-center justify-center gap-3">
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							<span>Création...</span>
						</span>
					) : (
						<span className="flex items-center justify-center gap-3">
							<Plus className="w-5 h-5" strokeWidth={2.5} />
							<span>Créer la catégorie</span>
						</span>
					)}
				</button>
			</div>
			{error && (
				<div className="mt-5 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium animate-shake">
					<div className="flex items-center gap-3">
						<AlertCircle className="w-5 h-5" />
						<span>{error}</span>
					</div>
				</div>
			)}
		</form>
	);
};
