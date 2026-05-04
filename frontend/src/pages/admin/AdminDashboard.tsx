import { useState, useEffect } from "react";
import { ProgressBar, useToast } from "../../components";
import api from "../../api/client";
import type { Project } from "../../types";
import { cn } from "../../utils";

interface DashboardStats {
	totalProjects: number;
	activeProjects: number;
	completedProjects: number;
	totalBuilders: number;
	totalClients: number;
	pendingRequests: number;
}

const projectStatusClasses: Record<Project["status"], string> = {
	planning:
		"border-[rgba(199,206,214,0.6)] bg-[rgba(199,206,214,0.15)] text-[#475462]",
	in_progress:
		"border-[rgba(199,206,214,0.6)] bg-[rgba(199,206,214,0.15)] text-[#475462]",
	on_hold:
		"border-[rgba(199,206,214,0.6)] bg-[rgba(199,206,214,0.15)] text-[#475462]",
	completed:
		"border-[rgba(199,206,214,0.6)] bg-[rgba(199,206,214,0.15)] text-[#475462]",
};

const statCardClass =
	"relative overflow-hidden border-black/10 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-brand-gold before:to-transparent before:content-['']";

export default function AdminDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalProjects: 0,
		activeProjects: 0,
		completedProjects: 0,
		totalBuilders: 0,
		totalClients: 0,
		pendingRequests: 0,
	});
	const [recentProjects, setRecentProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const toast = useToast();

	const loadDashboardData = async () => {
		setLoading(true);
		try {
			const [projectsRes, builderRes, clientRes, requestsRes] =
				await Promise.all([
					api
						.get<Project[]>("/api/projects/")
						.catch(() => ({ data: [] })),
					api
						.get<{ count: number }>("/api/users/builders/count")
						.catch(() => ({ data: { count: 0 } })),
					api
						.get<{ count: number }>("/api/users/clients/count")
						.catch(() => ({ data: { count: 0 } })),
					api
						.get<{
							count: number;
						}>("/api/admin/requests/pending/count")
						.catch(() => ({ data: { count: 0 } })),
				]);

			const projects = projectsRes.data;
			const activeProjects = projects.filter(
				(p) => p.status === "in_progress",
			).length;
			const completedProjects = projects.filter(
				(p) => p.status === "completed",
			).length;

			setStats({
				totalProjects: projects.length,
				activeProjects,
				completedProjects,
				totalBuilders: builderRes.data.count,
				totalClients: clientRes.data.count,
				pendingRequests: requestsRes.data.count,
			});

			setRecentProjects(projects.slice(0, 5));
		} catch {
			toast("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadDashboardData();
	}, []);

	if (loading) {
		return (
			<div className="flex min-h-[240px] flex-col gap-6 p-6 max-md:p-4">
				<div className="flex min-h-[240px] items-center justify-center rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] text-sm text-[#5d6a78]">
					Loading dashboard...
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-6 max-md:p-4">
			<div className="mb-2 flex flex-col gap-2">
				<h1 className="text-[1.75rem] font-semibold text-[#1f2a34] max-md:text-2xl">
					Admin Dashboard
				</h1>
				<p className="text-sm text-[#5d6a78]">
					System overview and management
				</p>
			</div>

			<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] max-lg:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] max-md:grid-cols-1">
				<div
					className={cn(
						"flex flex-col gap-3 rounded-lg border bg-[rgba(224,234,242,0.3)] p-4",
						statCardClass,
					)}
				>
					<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
						Total Projects
					</div>
					<div className="text-[1.75rem] font-bold text-[#1f2a34]">
						{stats.totalProjects}
					</div>
					<div className="h-1 overflow-hidden rounded-sm bg-black/5">
						<div
							className="h-full bg-[#c7ced6] transition-[width] duration-500 ease-out"
							style={{
								width: `${Math.min(100, (stats.totalProjects / 50) * 100)}%`,
							}}
						/>
					</div>
				</div>

				<div
					className={cn(
						"flex flex-col gap-3 rounded-lg border bg-[rgba(224,234,242,0.3)] p-4",
						statCardClass,
					)}
				>
					<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
						Active Projects
					</div>
					<div className="text-[1.75rem] font-bold text-[#1f2a34]">
						{stats.activeProjects}
					</div>
					<div className="text-sm text-[#5d6a78]">
						{(
							(stats.activeProjects /
								(stats.totalProjects || 1)) *
							100
						).toFixed(0)}
						% of total
					</div>
				</div>

				<div
					className={cn(
						"flex flex-col gap-3 rounded-lg border bg-[rgba(224,234,242,0.3)] p-4",
						statCardClass,
					)}
				>
					<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
						Completed
					</div>
					<div className="text-[1.75rem] font-bold text-[#1f2a34]">
						{stats.completedProjects}
					</div>
					<div className="text-sm text-[#5d6a78]">✓</div>
				</div>

				<div
					className={cn(
						"flex flex-col gap-3 rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] p-4",
						statCardClass,
					)}
				>
					<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
						Pending Approvals
					</div>
					<div className="text-[1.75rem] font-bold text-[#1f2a34]">
						{stats.pendingRequests}
					</div>
					<div>
						<a
							href="/admin/approvals"
							className="text-sm font-semibold text-[#475462] transition-colors duration-300 hover:text-[#1f2a34]"
						>
							Review →
						</a>
					</div>
				</div>

				<div
					className={cn(
						"flex flex-col gap-3 rounded-lg border bg-[rgba(224,234,242,0.3)] p-4",
						statCardClass,
					)}
				>
					<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
						Builders
					</div>
					<div className="text-[1.75rem] font-bold text-[#1f2a34]">
						{stats.totalBuilders}
					</div>
					<div className="text-sm text-[#5d6a78]">Approved</div>
				</div>

				<div
					className={cn(
						"flex flex-col gap-3 rounded-lg border bg-[rgba(224,234,242,0.3)] p-4",
						statCardClass,
					)}
				>
					<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
						Clients
					</div>
					<div className="text-[1.75rem] font-bold text-[#1f2a34]">
						{stats.totalClients}
					</div>
					<div className="text-sm text-[#5d6a78]">Registered</div>
				</div>
			</div>

			<div className="rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] p-4">
				<div className="mb-4 flex items-center justify-between gap-4 border-b border-black/10 pb-4 max-md:flex-col max-md:items-start">
					<h2 className="text-xl font-semibold text-[#1f2a34]">
						Recent Projects
					</h2>
					<a
						href="/admin/projects"
						className="text-sm font-semibold text-[#475462] transition-colors duration-300 hover:text-[#1f2a34]"
					>
						View All →
					</a>
				</div>

				{recentProjects.length === 0 ? (
					<div className="flex min-h-[160px] items-center justify-center rounded-md border border-dashed border-black/10 bg-black/5 text-sm text-[#5d6a78]">
						No projects yet
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{recentProjects.map((project) => (
							<div
								key={project.id}
								className="grid grid-cols-1 gap-4 rounded-md border border-black/10 bg-black/5 p-4 transition-all duration-300 hover:border-black/20 hover:bg-black/5 lg:grid-cols-[minmax(0,1fr)_200px_150px] max-lg:grid-cols-[minmax(0,1fr)_100px] max-md:grid-cols-1"
							>
								<div className="min-w-0">
									<h3 className="mb-1 text-lg font-semibold text-[#1f2a34]">
										{project.name}
									</h3>
									<p className="text-sm text-[#5d6a78]">
										{project.location || "No location"}
									</p>
								</div>
								<div className="flex min-w-0 flex-col gap-2">
									<ProgressBar
										value={project.overall_progress}
										max={100}
										label={`${project.overall_progress}%`}
									/>
								</div>
								<div className="flex justify-end max-lg:hidden">
									<span
										className={cn(
											"inline-flex whitespace-nowrap rounded-sm border px-3 py-2 text-[0.72rem] font-semibold capitalize",
											projectStatusClasses[
												project.status
											],
										)}
									>
										{project.status.replace("_", " ")}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
