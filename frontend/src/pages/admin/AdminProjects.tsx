import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar, useToast } from "../../components";
import api from "../../api/client";
import type { Project } from "../../types";
import { cn } from "../../utils";

const projectStatusClasses: Record<Project["status"], string> = {
	planning:
		"border-[rgba(127,140,141,0.3)] bg-[rgba(127,140,141,0.15)] text-[#7f8c8d]",
	in_progress:
		"border-[rgba(200,151,31,0.3)] bg-[rgba(200,151,31,0.15)] text-brand-gold",
	on_hold:
		"border-[rgba(230,126,34,0.3)] bg-[rgba(230,126,34,0.15)] text-[#e67e22]",
	completed:
		"border-[rgba(39,174,96,0.3)] bg-[rgba(39,174,96,0.15)] text-[#27ae60]",
};

export default function AdminProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
	const toast = useToast();
	const navigate = useNavigate();

	const loadProjects = async () => {
		setLoading(true);
		try {
			const res = await api.get<Project[]>("/api/projects/");
			setProjects(res.data);
		} catch {
			toast("Failed to load projects");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProjects();
	}, []);

	const filteredProjects = projects.filter((p) => {
		if (filter === "active") return p.status === "in_progress";
		if (filter === "completed") return p.status === "completed";
		return true;
	});

	const statusCounts = {
		all: projects.length,
		active: projects.filter((p) => p.status === "in_progress").length,
		completed: projects.filter((p) => p.status === "completed").length,
	};

	return (
		<div className="flex flex-col gap-6 p-6 max-md:p-4">
			<div className="mb-2 flex flex-col gap-2">
				<h1 className="text-[1.75rem] font-semibold text-[#1f2a34] max-md:text-2xl">
					All Projects
				</h1>
				<p className="text-sm text-[#5d6a78]">
					System-wide project management
				</p>
			</div>

			<div className="flex gap-4 border-b-2 border-black/10 max-md:gap-2 max-md:mb-1">
				<button
					type="button"
					className={cn(
						"relative -mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5d6a78] transition-colors duration-300 hover:text-[#1f2a34] max-md:px-3 max-md:py-2 max-md:text-xs",
						filter === "all" && "border-black/10 text-[#1f2a34]",
					)}
					onClick={() => setFilter("all")}
				>
					All Projects ({statusCounts.all})
				</button>
				<button
					type="button"
					className={cn(
						"relative -mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5d6a78] transition-colors duration-300 hover:text-[#1f2a34] max-md:px-3 max-md:py-2 max-md:text-xs",
						filter === "active" && "border-black/10 text-[#1f2a34]",
					)}
					onClick={() => setFilter("active")}
				>
					Active ({statusCounts.active})
				</button>
				<button
					type="button"
					className={cn(
						"relative -mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5d6a78] transition-colors duration-300 hover:text-[#1f2a34] max-md:px-3 max-md:py-2 max-md:text-xs",
						filter === "completed" &&
							"border-black/10 text-[#1f2a34]",
					)}
					onClick={() => setFilter("completed")}
				>
					Completed ({statusCounts.completed})
				</button>
			</div>

			{loading ? (
				<div className="flex min-h-[280px] items-center justify-center rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] text-sm text-[#5d6a78]">
					Loading projects...
				</div>
			) : filteredProjects.length === 0 ? (
				<div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] px-6 py-12 text-center">
					<div className="text-4xl">📋</div>
					<div className="text-lg font-semibold text-[#1f2a34]">
						No projects found
					</div>
					<div className="text-sm text-[#5d6a78]">
						{filter === "all"
							? "Start by creating your first project"
							: `No ${filter} projects at this time`}
					</div>
				</div>
			) : (
				<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(400px,1fr))] max-lg:[grid-template-columns:repeat(auto-fill,minmax(350px,1fr))] max-md:grid-cols-1">
					{filteredProjects.map((project) => (
						<button
							key={project.id}
							type="button"
							className="flex flex-col gap-4 rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:bg-black/5"
							onClick={() =>
								navigate(`/builder/projects/${project.id}`)
							}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0 flex-1">
									<h3 className="mb-1 text-lg font-semibold text-[#1f2a34]">
										{project.name}
									</h3>
									{project.location && (
										<p className="text-sm text-[#5d6a78]">
											📍 {project.location}
										</p>
									)}
								</div>
								<span
									className={cn(
										"shrink-0 whitespace-nowrap rounded-sm border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.05em]",
										projectStatusClasses[project.status],
									)}
								>
									{project.status.replace("_", " ")}
								</span>
							</div>

							{project.description && (
								<p className="text-sm leading-6 text-[#888888]">
									{project.description}
								</p>
							)}

							<div className="flex flex-col gap-2">
								<div className="text-sm font-semibold uppercase tracking-[0.05em] text-[#888888]">
									Progress
								</div>
								<ProgressBar
									value={project.overall_progress}
									max={100}
									label={`${project.overall_progress}%`}
								/>
							</div>

							<div className="grid gap-3 border-t border-black/10 pt-4 sm:grid-cols-2">
								{project.start_date && (
									<div className="flex flex-col gap-1">
										<span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#888888]">
											Started
										</span>
										<span className="text-sm font-medium text-[#1f2a34]">
											{new Date(
												project.start_date,
											).toLocaleDateString()}
										</span>
									</div>
								)}
								{project.expected_end_date && (
									<div className="flex flex-col gap-1">
										<span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#888888]">
											Expected End
										</span>
										<span className="text-sm font-medium text-[#1f2a34]">
											{new Date(
												project.expected_end_date,
											).toLocaleDateString()}
										</span>
									</div>
								)}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
