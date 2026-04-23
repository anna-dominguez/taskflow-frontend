import * as Sentry from '@sentry/react';
import { useState, useEffect } from 'react';
import type { Category, Task } from './types';
import { fetchCategories, fetchTasks } from './api';
import { CategoryForm } from './components/CategoryForm';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import {
	Sparkles,
	AlertTriangle,
	Tag,
	List,
	Folder,
	FolderOpen,
	BarChart3,
} from 'lucide-react';

function App() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');

	const loadData = async () => {
		setLoading(true);
		setError('');
		try {
			const [categoriesData, tasksData] = await Promise.all([
				fetchCategories(),
				fetchTasks(filterCategoryId || undefined),
			]);
			setCategories(categoriesData);
			setTasks(tasksData);
		} catch (err) {
			setError(
				"Erreur de connexion à l'API. Vérifiez que le serveur Django est démarré.",
			);
			console.error('Erreur de chargement:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, [filterCategoryId]);

	const completedTasks = tasks.filter((t) => t.is_completed).length;
	const totalTasks = tasks.length;

	return (
		<>
		<div className="min-h-screen p-8 lg:p-12">
			{/* Header moderne avec glassmorphism */}
			<header className="text-center text-white mb-16 animate-fade-in">
				<div className="inline-block backdrop-blur-md bg-white/10 rounded-3xl px-12 py-8 shadow-2xl border border-white/20">
					<div className="flex items-center justify-center gap-5 mb-4">
						<Sparkles className="w-16 h-16 text-purple-200" strokeWidth={2} />
						<h1 className="text-7xl font-black bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
							TaskFlow
						</h1>
					</div>
					<button
						type="button"
						className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-mono shadow-lg"
						onClick={() => {throw new Error('Test Sentry')}}
					>
						Test Sentry
					</button>
					{totalTasks > 0 && (
						<div className="mt-6 flex items-center justify-center gap-8 text-base">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
								<span className="font-semibold">
									{completedTasks} terminées
								</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
								<span className="font-semibold">
									{totalTasks - completedTasks} en cours
								</span>
							</div>
						</div>
					)}
				</div>
			</header>

			{/* Error Banner amélioré */}
			{error && (
				<div className="max-w-7xl mx-auto mb-8 backdrop-blur-md bg-red-500/90 text-white p-6 rounded-2xl text-center shadow-2xl border border-red-400/50 animate-slide-down">
					<div className="flex items-center justify-center gap-4">
						<AlertTriangle className="w-7 h-7" />
						<span className="font-semibold text-lg">{error}</span>
					</div>
				</div>
			)}

			{/* Main Container avec meilleur spacing */}
			<div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-10 max-w-[1800px] mx-auto">
				{/* Sidebar élégante */}
				<aside className="flex flex-col gap-8">
					<CategoryForm onCategoryAdded={loadData} />

					{/* Category Filter redesigné */}
					<div className="backdrop-blur-md bg-white/95 rounded-3xl p-8 shadow-2xl border border-white/50">
						<div className="flex items-center gap-3 mb-6">
							<Tag className="w-7 h-7 text-indigo-600" strokeWidth={2} />
							<h3 className="text-gray-800 text-2xl font-bold">Catégories</h3>
						</div>
						<div className="space-y-3">
							<button
								type="button"
								className={`group w-full p-5 rounded-xl text-left font-medium transition-all duration-200 ${
									filterCategoryId === null
										? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-[1.02]'
										: 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-[1.01]'
								}`}
								onClick={() => setFilterCategoryId(null)}
							>
								<div className="flex items-center justify-between">
									<span className="flex items-center gap-3">
										<List className="w-5 h-5" strokeWidth={2} />
										<span className="text-base">Toutes les tâches</span>
									</span>
									<span
										className={`text-sm font-bold px-4 py-1.5 rounded-full ${
											filterCategoryId === null ? 'bg-white/20' : 'bg-gray-200'
										}`}
									>
										{totalTasks}
									</span>
								</div>
							</button>
							{categories.map((cat) => (
								<button
									type="button"
									key={cat.id}
									className={`group w-full p-5 rounded-xl text-left font-medium transition-all duration-200 ${
										filterCategoryId === cat.id
											? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-[1.02]'
											: 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-[1.01]'
									}`}
									onClick={() => setFilterCategoryId(cat.id)}
								>
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-3">
											<Folder className="w-5 h-5" strokeWidth={2} />
											<span className="text-base">{cat.name}</span>
										</span>
										<span
											className={`text-sm font-bold px-4 py-1.5 rounded-full ${
												filterCategoryId === cat.id
													? 'bg-white/20'
													: 'bg-gray-200'
											}`}
										>
											{cat.tasks_count}
										</span>
									</div>
								</button>
							))}
						</div>
					</div>
				</aside>

				{/* Main Content redesigné */}
				<main className="backdrop-blur-md bg-white/95 rounded-3xl p-10 lg:p-12 shadow-2xl border border-white/50">
					<TaskForm categories={categories} onTaskAdded={loadData} />

					{loading ? (
						<div className="text-center py-24">
							<div className="inline-block">
								<div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
								<p className="mt-6 text-gray-600 font-medium text-lg">
									Chargement...
								</p>
							</div>
						</div>
					) : (
						<>
							{/* Tasks Header amélioré */}
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 pb-8 border-b-2 border-gradient-to-r from-indigo-200 to-purple-200">
								<h2 className="text-gray-800 text-3xl font-bold flex items-center gap-4">
									{filterCategoryId ? (
										<FolderOpen
											className="w-10 h-10 text-indigo-600"
											strokeWidth={2}
										/>
									) : (
										<BarChart3
											className="w-10 h-10 text-indigo-600"
											strokeWidth={2}
										/>
									)}
									<span>
										{filterCategoryId
											? categories.find((c) => c.id === filterCategoryId)?.name
											: 'Toutes les tâches'}
									</span>
								</h2>
								<div className="flex items-center gap-4">
									<div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-base">
										{tasks.length} tâche{tasks.length > 1 ? 's' : ''}
									</div>
									{totalTasks > 0 && (
										<div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-base">
											{Math.round((completedTasks / totalTasks) * 100)}%
										</div>
									)}
								</div>
							</div>
							<TaskList
								tasks={tasks}
								onTaskUpdated={loadData}
								filterCategoryId={filterCategoryId}
							/>
						</>
					)}
				</main>
			</div>
		</div>

		</>
	);
}

export default Sentry.withProfiler(App);
