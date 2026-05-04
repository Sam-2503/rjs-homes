import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useToast } from "../../components/Toast";
import { cn } from "../../utils/cn";
import type { Project, ProjectStatus } from "../../types";

const STATUS_COLOR: Record<ProjectStatus, string> = {
	planning: "#c7ced6",
	in_progress: "#c7ced6",
	on_hold: "#c7ced6",
	completed: "#c7ced6",
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
	planning: "Planning",
	in_progress: "Active",
	on_hold: "On Hold",
	completed: "Complete",
};

const STATUS_BADGE: Record<ProjectStatus, string> = {
	planning: "bg-[#eef3f6] text-[#475462]",
	in_progress: "bg-[#eef3f6] text-[#475462]",
	on_hold: "bg-[#eef3f6] text-[#475462]",
	completed: "bg-[#eef3f6] text-[#475462]",
};

export default function BuilderDashboard() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const toast = useToast();

	useEffect(() => {
		api.get<Project[]>("/api/projects/")
			.then((r) => setProjects(r.data))
			.catch(() => toast("Failed to load projects"))
			.finally(() => setLoading(false));
	}, []);

	const total = projects.length;
	const active = projects.filter((p) => p.status === "in_progress").length;
	const completed = projects.filter((p) => p.status === "completed").length;
	const avgProg = total
		? Math.round(
				projects.reduce((a, p) => a + p.overall_progress, 0) / total,
			)
		: 0;

	return (
		<>
			{/* Topbar */}
			<div className="border-b border-black/10 bg-[#f8fafb] px-6 py-6 backdrop-blur-sm">
				<div className="text-3xl font-semibold text-[#1f2a34]">
					Dashboard
				</div>
			</div>

			<div className="animate-fade-up space-y-8 px-6 py-8">
				{/* KPIs */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-2xl border border-black/10 border-t-2 border-t-[#c7ced6] bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm transition hover:border-black/20 hover:bg-[rgba(224,234,242,0.5)]">
						<div className="text-sm uppercase tracking-[0.12em] text-[#5d6a78]">
							Total Projects
						</div>
						<div className="mt-3 text-4xl font-semibold text-[#1f2a34]">
							{total}
						</div>
						<div className="mt-2 text-xs text-[#8b9ba9]">
							All time
						</div>
					</div>
					<div className="rounded-2xl border border-black/10 border-t-2 border-t-[#c7ced6] bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm transition hover:border-black/20 hover:bg-[rgba(224,234,242,0.5)]">
						<div className="text-sm uppercase tracking-[0.12em] text-[#5d6a78]">
							Active Builds
						</div>
						<div className="mt-3 text-4xl font-semibold text-[#1f2a34]">
							{active}
						</div>
						<div className="mt-2 text-xs text-[#8b9ba9]">
							In progress
						</div>
					</div>
					<div className="rounded-2xl border border-black/10 border-t-2 border-t-[#c7ced6] bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm transition hover:border-black/20 hover:bg-[rgba(224,234,242,0.5)]">
						<div className="text-sm uppercase tracking-[0.12em] text-[#5d6a78]">
							Completed
						</div>
						<div className="mt-3 text-4xl font-semibold text-[#1f2a34]">
							{completed}
						</div>
						<div className="mt-2 text-xs text-[#8b9ba9]">
							Delivered
						</div>
					</div>
					<div className="rounded-2xl border border-black/10 border-t-2 border-t-[#c7ced6] bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm transition hover:border-black/20 hover:bg-[rgba(224,234,242,0.5)]">
						<div className="text-sm uppercase tracking-[0.12em] text-[#5d6a78]">
							Avg Progress
						</div>
						<div className="mt-3 text-4xl font-semibold text-[#1f2a34]">
							{avgProg}%
						</div>
						<div className="mt-2 text-xs text-[#8b9ba9]">
							Across all projects
						</div>
					</div>
				</div>

				{/* Projects header */}
				<div className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#5d6a78]">
					All Projects
				</div>

				{/* Projects grid */}
				{loading ? (
					<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-12 text-center backdrop-blur-sm">
						<div className="text-sm text-[#5d6a78]">
							Loading projects…
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
						{projects.map((p) => (
							<div
								key={p.id}
								className="cursor-pointer rounded-2xl border border-black/10 border-t-2 bg-[rgba(224,234,242,0.3)] p-5 transition hover:border-black/20 hover:bg-[rgba(224,234,242,0.5)]"
								style={{
									borderTopColor: STATUS_COLOR[p.status],
								}}
								onClick={() =>
									navigate(`/builder/projects/${p.id}`)
								}
							>
								<div className="space-y-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<div className="font-medium text-[#1f2a34]">
												{p.name}
											</div>
											<div className="mt-1 text-xs text-[#5d6a78]">
												{p.location ?? "Location TBD"}
											</div>
										</div>
										<span
											className={cn(
												"rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase",
												STATUS_BADGE[p.status],
											)}
										>
											{STATUS_LABEL[p.status]}
										</span>
									</div>

									<div>
										<div className="mb-2 flex items-center justify-between text-[0.7rem]">
											<span className="text-[#5d6a78]">
												Progress
											</span>
											<span className="font-semibold text-[#1f2a34]">
												{p.overall_progress}%
											</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-black/5">
											<div
												className="h-full rounded-full"
												style={{
													width: `${p.overall_progress}%`,
													background:
														STATUS_COLOR[p.status],
												}}
											/>
										</div>
									</div>
								</div>

								<div className="mt-4 border-t border-black/10 pt-3 text-[0.72rem]">
									<div className="text-[#5d6a78]">
										Status:{" "}
										<span className="text-[#475462]">
											{STATUS_LABEL[p.status]}
										</span>
									</div>
									<div className="mt-2 text-[#8b9ba9]">
										{p.start_date
											? new Date(
													p.start_date,
												).toLocaleDateString("en-IN", {
													month: "short",
													year: "numeric",
												})
											: "—"}
									</div>
								</div>
							</div>
						))}

						{/* Add new card */}
						<div
							className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-black/15 bg-[rgba(224,234,242,0.3)] p-8 text-center transition hover:border-black/20 hover:bg-[rgba(224,234,242,0.5)]"
							onClick={() => navigate("/builder/projects")}
						>
							<div className="text-[#1f2a34]">
								<div className="mb-2 text-2xl font-semibold">
									+
								</div>
								<div className="text-sm font-medium">
									Create New Project
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
