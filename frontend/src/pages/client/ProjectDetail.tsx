import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useToast } from "../../components/Toast";
import { cn } from "../../utils/cn";
import type { Project, Update, Query } from "../../types";

type ActiveTab = "updates" | "queries" | "info";

export default function ClientProjectDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const [project, setProject] = useState<Project | null>(null);
	const [updates, setUpdates] = useState<Update[]>([]);
	const [queries, setQueries] = useState<Query[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<ActiveTab>("updates");
	const [newQuery, setNewQuery] = useState("");
	const [submittingQuery, setSubmittingQuery] = useState(false);

	const load = async () => {
		if (!id) return;
		setLoading(true);
		try {
			const [projRes, updatesRes, queriesRes] = await Promise.all([
				api.get<Project>(`/api/projects/${id}`),
				api.get<Update[]>(`/api/updates/${id}`),
				api.get<Query[]>(`/api/queries?project_id=${id}`),
			]);
			setProject(projRes.data);
			setUpdates(updatesRes.data);
			setQueries(queriesRes.data);
		} catch (err: any) {
			toast(err?.response?.data?.detail || "Failed to load project");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, [id]);

	const handleSubmitQuery = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newQuery.trim() || !id) return;

		setSubmittingQuery(true);
		try {
			await api.post("/api/queries", {
				project_id: id,
				question: newQuery.trim(),
			});
			toast("Question submitted successfully");
			setNewQuery("");
			await load();
		} catch (err: any) {
			toast(err?.response?.data?.detail || "Failed to submit question");
		} finally {
			setSubmittingQuery(false);
		}
	};

	const tabClass = (tab: ActiveTab) =>
		cn(
			"border-b-2 px-1 py-2 text-base font-medium transition",
			activeTab === tab
				? "border-[#fbbf24] text-[#f59e0b] font-semibold"
				: "border-transparent text-[#5d6a78] hover:text-[#f59e0b]",
		);

	if (loading) {
		return (
			<div className="border-b border-black/10 bg-[linear-gradient(160deg,rgba(243,247,250,0.4)_0%,rgba(238,243,246,0.4)_100%)] px-6 py-6 backdrop-blur-sm">
				<div className="text-3xl font-semibold text-[#1f2a34]">
					Loading project...
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="flex min-h-[calc(100vh-1px)] items-center justify-center px-6 py-10">
				<div className="w-full max-w-md rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-8 text-center backdrop-blur-sm">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(239,68,68,0.15)] text-lg font-semibold text-[#f97316]">
						•
					</div>
					<div className="text-2xl font-semibold text-[#1f2a34]">
						Project Not Found
					</div>
					<p className="mt-2 text-sm text-[#5d6a78]">
						The requested project could not be loaded.
					</p>
					<button
						onClick={() => navigate("/client")}
						className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#fbbf24]/35 bg-[rgba(251,191,36,0.1)] px-4 py-2 text-sm font-semibold text-[#fbbf24] transition hover:border-[#fbbf24]/50 hover:bg-[rgba(251,191,36,0.15)]"
					>
						Back to Projects
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 px-6 py-8 animate-fade-up">
			<div className="border-b border-black/10 bg-[linear-gradient(160deg,rgba(243,247,250,0.4)_0%,rgba(238,243,246,0.4)_100%)] mb-2 -mx-6 -mt-8 px-6 py-6 backdrop-blur-sm">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate("/client")}
						className="inline-flex items-center gap-2 rounded-xl border border-[#fbbf24]/35 px-3 py-2 text-sm font-medium text-[#fbbf24] transition hover:border-[#fbbf24]/50 hover:bg-[rgba(251,191,36,0.1)]"
					>
						<span>←</span>
						Back
					</button>
					<div className="min-w-0">
						<div className="text-3xl font-semibold text-[#1f2a34]">
							{project.name}
						</div>
						{project.location && (
							<div className="mt-1 text-sm text-[#5d6a78]">
								{project.location}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<div className="flex border-b border-black/10">
					<button
						onClick={() => setActiveTab("updates")}
						className={tabClass("updates")}
					>
						Updates ({updates.length})
					</button>
					<button
						onClick={() => setActiveTab("queries")}
						className={tabClass("queries")}
					>
						Questions ({queries.length})
					</button>
					<button
						onClick={() => setActiveTab("info")}
						className={tabClass("info")}
					>
						Info
					</button>
				</div>

				{activeTab === "updates" && (
					<div>
						{updates.length === 0 ? (
							<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] px-8 py-12 text-center backdrop-blur-sm">
								<div className="text-sm text-[#5d6a78]">
									No updates yet
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{updates.map((update) => (
									<div
										key={update.id}
										className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm"
									>
										<div className="mb-4 flex items-start justify-between gap-4 max-md:flex-col">
											<div>
												<h3 className="mb-2 text-xl font-semibold text-[#1f2a34]">
													{update.title}
												</h3>
												<div className="flex flex-wrap gap-4 text-sm text-[#5d6a78]">
													<span>
														{update.category.replace(
															"_",
															" ",
														)}
													</span>
													<span>
														{new Date(
															update.created_at,
														).toLocaleDateString()}
													</span>
												</div>
											</div>
											<div className="rounded-lg bg-[#fbbf24] px-3 py-1.5 text-sm font-semibold text-[#1f2a34]">
												{update.progress_percentage}%
											</div>
										</div>

										{update.description && (
											<p className="mb-4 text-sm leading-6 text-[#5d6a78]">
												{update.description}
											</p>
										)}

										{update.photo_urls &&
											update.photo_urls.length > 0 && (
												<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
													{update.photo_urls.map(
														(url, idx) => (
															<img
																key={idx}
																src={url}
																alt={`Update ${idx + 1}`}
																className="max-h-[300px] w-full rounded-2xl object-cover"
																onError={(
																	e,
																) => {
																	e.currentTarget.classList.add(
																		"hidden",
																	);
																}}
															/>
														),
													)}
												</div>
											)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "queries" && (
					<div className="flex flex-col gap-6">
						<form
							onSubmit={handleSubmitQuery}
							className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm"
						>
							<h3 className="mb-4 text-xl font-semibold text-[#1f2a34]">
								Ask a Question
							</h3>
							<textarea
								placeholder="Ask the builder about this project..."
								value={newQuery}
								onChange={(e) => setNewQuery(e.target.value)}
								disabled={submittingQuery}
								className="min-h-[120px] w-full resize-y rounded-xl border border-black/10 bg-[rgba(224,234,242,0.5)] px-4 py-3 text-sm text-[#1f2a34] outline-none transition placeholder:text-[#8b9ba9] focus:border-[#fbbf24]/35 focus:bg-[rgba(224,234,242,0.7)] focus:ring-2 focus:ring-[#fbbf24]/10 disabled:cursor-not-allowed disabled:opacity-50"
							/>
							<div className="mt-4 flex gap-3 max-md:flex-col">
								<button
									type="submit"
									disabled={
										submittingQuery || !newQuery.trim()
									}
									className="inline-flex w-full max-w-[200px] items-center justify-center rounded-xl border border-[#fbbf24]/35 bg-[rgba(251,191,36,0.1)] px-4 py-2.5 text-sm font-semibold text-[#fbbf24] transition hover:border-[#fbbf24]/50 hover:bg-[rgba(251,191,36,0.15)] disabled:cursor-not-allowed disabled:opacity-60 max-md:max-w-none"
								>
									{submittingQuery
										? "Submitting..."
										: "Submit Question"}
								</button>
							</div>
						</form>

						{queries.length === 0 ? (
							<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] px-8 py-12 text-center backdrop-blur-sm">
								<div className="text-sm text-[#5d6a78]">
									No questions asked yet
								</div>
								<div className="mt-2 text-xs text-[#8b9ba9]">
									Ask your first question above
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{queries.map((query) => (
									<div
										key={query.id}
										className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm"
									>
										<div className="mb-4 flex items-start justify-between gap-4 max-md:flex-col">
											<div className="min-w-0">
												<h3 className="mb-2 text-lg font-semibold text-[#1f2a34]">
													{query.question}
												</h3>
												<div className="text-sm text-[#5d6a78]">
													{new Date(
														query.created_at,
													).toLocaleDateString()}
												</div>
											</div>
											<div
												className={cn(
													"rounded-lg px-3 py-1.5 text-sm font-semibold whitespace-nowrap",
													query.status === "resolved"
														? "bg-[#10b981] text-white"
														: "bg-[#f97316] text-white",
												)}
											>
												{query.status}
											</div>
										</div>

										{query.answer && (
											<div className="rounded-xl border-l-4 border-[#fbbf24] bg-[rgba(251,191,36,0.08)] p-4">
												<div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#fbbf24]">
													Builder's Response:
												</div>
												<p className="text-sm leading-6 text-[#5d6a78]">
													{query.answer}
												</p>
												{(query.answer_media_urls ?? [])
													.length > 0 && (
													<div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
														{(
															query.answer_media_urls ??
															[]
														).map((url) => (
															<img
																key={url}
																src={url}
																alt="Builder response media"
																className="h-24 w-full rounded-md object-cover"
															/>
														))}
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "info" && (
					<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm">
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<div>
								<div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
									Status
								</div>
								<div className="text-lg font-semibold text-[#1f2a34]">
									{project.status.replace("_", " ")}
								</div>
							</div>

							<div>
								<div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
									Overall Progress
								</div>
								<div className="text-lg font-semibold text-[#f59e0b]">
									{project.overall_progress}%
								</div>
							</div>

							{project.location && (
								<div>
									<div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
										Location
									</div>
									<div className="text-base text-[#1f2a34]">
										{project.location}
									</div>
								</div>
							)}

							{project.start_date && (
								<div>
									<div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
										Started
									</div>
									<div className="text-base text-[#1f2a34]">
										{new Date(
											project.start_date,
										).toLocaleDateString()}
									</div>
								</div>
							)}

							{project.expected_end_date && (
								<div>
									<div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
										Expected End
									</div>
									<div className="text-base text-[#1f2a34]">
										{new Date(
											project.expected_end_date,
										).toLocaleDateString()}
									</div>
								</div>
							)}
						</div>

						{project.description && (
							<div className="mt-8 border-t border-black/10 pt-6">
								<div className="mb-2 text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
									Description
								</div>
								<p className="text-sm leading-6 text-[#5d6a78]">
									{project.description}
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
