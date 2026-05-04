import { useEffect, useState } from "react";
import api from "../../api/client";
import { useToast } from "../../components/Toast";
import { cn } from "../../utils/cn";
import type { Project } from "../../types";

export default function ClientProgress() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const toast = useToast();

	const progressFillClass = (status: Project["status"], progress: number) =>
		progress === 100
			? "bg-[#10b981]"
			: progress >= 75
				? "bg-[#fbbf24]"
				: status === "completed"
					? "bg-[#10b981]"
					: "bg-[#f97316]";

	const renderProgressBar = (status: Project["status"], progress: number) => {
		const filledSegments = Math.ceil((progress / 100) * 20);
		return (
			<div className="mb-2 flex h-1.5 gap-px overflow-hidden rounded-full bg-black/5">
				{Array.from({ length: 20 }).map((_, index) => (
					<div
						key={index}
						className={cn(
							"flex-1 rounded-full",
							index < filledSegments
								? progressFillClass(status, progress)
								: "bg-transparent",
						)}
					/>
				))}
			</div>
		);
	};

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const response = await api.get<Project[]>("/api/projects");
				setProjects(
					response.data.sort(
						(a, b) => b.overall_progress - a.overall_progress,
					),
				);
			} catch {
				toast("Failed to load projects");
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	return (
		<>
			<div className="border-b border-black/10 bg-[#f8fafb] px-6 py-8 backdrop-blur-sm">
				<h1 className="text-4xl font-bold text-[#1f2a34]">
					Progress Tracking
				</h1>
				<p className="mt-2 text-[#5d6a78]">
					Monitor your project progress
				</p>
			</div>

			<div className="animate-fade-up space-y-6 px-6 py-8">
				<div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5d6a78]">
					Project Progress
				</div>

				{loading ? (
					<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-12 text-center backdrop-blur-sm">
						<div className="text-sm text-[#5d6a78]">
							Loading progress…
						</div>
					</div>
				) : projects.length === 0 ? (
					<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-12 text-center backdrop-blur-sm">
						<div className="text-sm text-[#5d6a78]">
							No projects yet
						</div>
					</div>
				) : (
					<div className="grid gap-4">
						{projects.map((p) => (
							<div
								key={p.id}
								className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm"
							>
								<div className="mb-4 flex items-center justify-between">
									<div>
										<div className="font-medium text-[#1f2a34]">
											{p.name}
										</div>
										<div className="mt-1 text-xs text-[#5d6a78]">
											{p.location ?? "Location TBD"}
										</div>
									</div>
									<span className="text-2xl font-semibold text-[#f59e0b]">
										{p.overall_progress}%
									</span>
								</div>

								{renderProgressBar(
									p.status,
									p.overall_progress,
								)}

								<div className="mt-4 grid grid-cols-3 gap-4 border-t border-black/10 pt-4 text-[0.75rem]">
									<div>
										<div className="text-[#5d6a78]">
											Start
										</div>
										<div className="mt-1 font-medium text-[#1f2a34]">
											{p.start_date
												? new Date(
														p.start_date,
													).toLocaleDateString(
														"en-IN",
														{
															day: "2-digit",
															month: "short",
														},
													)
												: "—"}
										</div>
									</div>
									<div>
										<div className="text-[#5d6a78]">
											Expected End
										</div>
										<div className="mt-1 font-medium text-[#1f2a34]">
											{p.expected_end_date
												? new Date(
														p.expected_end_date,
													).toLocaleDateString(
														"en-IN",
														{
															day: "2-digit",
															month: "short",
														},
													)
												: "—"}
										</div>
									</div>
									<div>
										<div className="text-[#5d6a78]">
											Status
										</div>
										<div
											className={
												p.status === "completed"
													? "mt-1 font-medium text-[#10b981]"
													: p.status === "in_progress"
														? "mt-1 font-medium text-[#f59e0b]"
														: "mt-1 font-medium text-[#f97316]"
											}
										>
											{p.status.replace("_", " ")}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
