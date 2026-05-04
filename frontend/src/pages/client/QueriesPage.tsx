import { useState, useEffect } from "react";
import { useToast, QueryForm, QueryList } from "../../components";
import api from "../../api/client";
import type { Query, CreateQueryRequest, Project } from "../../types";

export default function ClientQueriesPage() {
	const [queries, setQueries] = useState<Query[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const toast = useToast();

	const loadData = async () => {
		setLoading(true);
		try {
			const [projectsRes, queriesRes] = await Promise.all([
				api
					.get<Project[]>("/api/projects/")
					.catch(() => ({ data: [] })),
				api.get<Query[]>("/api/queries").catch(() => ({ data: [] })),
			]);

			setProjects(projectsRes.data);
			setQueries(queriesRes.data);

			if (projectsRes.data.length > 0 && !selectedProjectId) {
				setSelectedProjectId(projectsRes.data[0].id);
			}
		} catch {
			toast("Failed to load data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleSubmitQuery = async (query: CreateQueryRequest) => {
		setSubmitting(true);
		try {
			await api.post("/api/queries", query);
			toast("Question submitted successfully");
			await loadData();
		} catch (err: any) {
			toast(err?.response?.data?.detail || "Failed to submit question");
		} finally {
			setSubmitting(false);
		}
	};

	const filteredQueries = selectedProjectId
		? queries.filter((q) => q.project_id === selectedProjectId)
		: [];

	return (
		<>
			<div className="border-b border-black/10 bg-[#f8fafb] px-6 py-8 backdrop-blur-sm">
				<h1 className="text-4xl font-bold text-[#1f2a34]">Questions</h1>
				<p className="mt-2 text-[#5d6a78]">
					Ask the builder about your project
				</p>
			</div>

			<div className="animate-fade-up space-y-6 px-6 py-8 text-[#1f2a34]">
				{loading ? (
					<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] px-8 py-12 text-center backdrop-blur-sm">
						<div className="text-sm text-[#5d6a78]">
							Loading projects...
						</div>
					</div>
				) : (
					<div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
						<div className="sticky top-6 hidden lg:block">
							<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm">
								<div className="mb-4 border-b border-black/10 pb-4 text-lg font-semibold text-[#1f2a34]">
									Your Projects
								</div>
								<div className="flex flex-col gap-2">
									{projects.length === 0 ? (
										<div className="rounded-xl bg-black/5 px-4 py-4 text-center text-sm text-[#5d6a78]">
											No projects assigned
										</div>
									) : (
										projects.map((project) => (
											<button
												key={project.id}
												className={
													selectedProjectId ===
													project.id
														? "flex flex-col gap-1 rounded-xl border border-black/10 bg-[#f8fafb] px-4 py-3 text-left transition"
														: "flex flex-col gap-1 rounded-xl border border-black/10 px-4 py-3 text-left transition hover:border-black/20 hover:bg-black/5"
												}
												onClick={() =>
													setSelectedProjectId(
														project.id,
													)
												}
											>
												<div className="font-semibold text-[#1f2a34]">
													{project.name}
												</div>
												<div
													className={`text-xs ${selectedProjectId === project.id ? "text-[#1f2a34]" : "text-[#5d6a78]"}`}
												>
													{
														queries.filter(
															(q) =>
																q.project_id ===
																project.id,
														).length
													}{" "}
													{queries.filter(
														(q) =>
															q.project_id ===
															project.id,
													).length === 1
														? "question"
														: "questions"}
												</div>
											</button>
										))
									)}
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className="flex min-w-0 flex-col gap-6">
							{selectedProjectId ? (
								<>
									{/* Query Form */}
									<QueryForm
										projectId={selectedProjectId}
										onSubmit={handleSubmitQuery}
										loading={submitting}
									/>

									{/* Queries List */}
									<div className="flex flex-col gap-4">
										<div className="text-lg font-semibold text-[#1f2a34]">
											Questions ({filteredQueries.length})
										</div>
										<QueryList
											queries={filteredQueries}
											loading={false}
										/>
									</div>
								</>
							) : (
								<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] px-8 py-12 text-center backdrop-blur-sm">
									<div className="text-[#5d6a78]">
										Select a project to ask questions
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
