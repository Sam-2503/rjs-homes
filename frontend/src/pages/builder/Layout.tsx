import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import type { Project } from "../../types";
import api from "../../api/client";

const STATUS_COLOR: Record<string, string> = {
	planning: "#c7ced6",
	in_progress: "#c7ced6",
	on_hold: "#c7ced6",
	completed: "#c7ced6",
};

export default function BuilderLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [projects, setProjects] = useState<Project[]>([]);
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);
	const profileMenuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		api.get<Project[]>("/api/projects/")
			.then((r) => setProjects(r.data))
			.catch(() => {});
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target as Node)
			) {
				setProfileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const initials =
		user?.full_name
			?.split(" ")
			.map((w) => w[0])
			.join("")
			.toUpperCase()
			.slice(0, 2) ?? "RJ";

	const doLogout = () => {
		logout();
		navigate("/login");
	};

	const isAdmin = user?.role === "admin";

	const nav = [
		{ to: "/builder", label: "Dashboard", end: true },
		...(isAdmin
			? []
			: [
					{ to: "/builder/projects", label: "Projects" },
					{ to: "/builder/updates", label: "Post Update" },
					{
						to: "/builder/materials",
						label: "Materials Log",
					},
					{ to: "/builder/clients", label: "Clients" },
				]),
		...(isAdmin
			? [
					{
						to: "/admin/approvals",
						label: "Builder Approvals",
						end: false,
					},
					{ to: "/admin/projects", label: "All Projects" },
				]
			: []),
	];

	return (
		<>
			{isAdmin ? (
				<title>RJS Homes - Admin Portal</title>
			) : (
				<title>RJS Homes - Builder Portal</title>
			)}
			<div className="flex min-h-screen w-full bg-[#eef3f6] text-[#1f2a34]">
				{/* ── SIDEBAR ── */}
				<div className="flex w-[300px] shrink-0 flex-col border-r border-black/10 bg-[#f8fafb] backdrop-blur-xl">
					{/* Logo */}
					<div className="flex mb-6 border-b border-black/10 px-6 py-6">
						<img
							src="/rjs-logo.svg"
							className="h-12 w-12 rounded-full border border-black/10 bg-[#eef3f6] shadow-[0_8px_24px_rgba(31,42,52,0.08)]"
						/>
						<div>
							<div className="pl-8 font-serif text-lg font-semibold text-[#1f2a34]">
								RJS Homes
							</div>
							<div className="pl-8 text-[10px] uppercase tracking-[0.12em] text-[#5d6a78]">
								{isAdmin ? "Admin Portal" : "Builder Portal"}
							</div>
						</div>
					</div>

					{/* Project quick-switcher */}
					{!isAdmin && (
						<>
							<div className="mb-2 flex items-center justify-between px-4">
								<div className="text-xs uppercase tracking-[0.12em] text-[#5d6a78]">
									Projects
								</div>
								<button
									className="rounded-lg border border-black/10 px-2 py-1 text-[0.62rem] uppercase tracking-[0.08em] text-[#475462] transition hover:border-black/20 hover:bg-black/5"
									onClick={() =>
										navigate("/builder/projects")
									}
								>
									+ New
								</button>
							</div>

							<div className="mx-3 mb-4 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-black/10 bg-black/5 p-2">
								{projects.slice(0, 6).map((p) => (
									<div
										key={p.id}
										className="cursor-pointer rounded-lg border border-transparent px-2 py-2 transition hover:border-black/20 hover:bg-black/5"
										onClick={() =>
											navigate(
												`/builder/projects/${p.id}`,
											)
										}
									>
										<div className="truncate text-xs font-medium text-[#1f2a34]">
											{p.name}
										</div>
										<div className="mt-1 text-[0.68rem] text-[#5d6a78]">
											<span
												style={{
													display: "inline-block",
													width: 6,
													height: 6,
													borderRadius: "50%",
													background:
														STATUS_COLOR[
															p.status
														] ?? "#444",
													marginRight: 5,
													verticalAlign: "middle",
												}}
											/>
											{p.overall_progress}% ·{" "}
											{p.status.replace("_", " ")}
										</div>
									</div>
								))}
								{projects.length === 0 && (
									<div className="px-2 py-1 text-[0.72rem] text-[#5d6a78]">
										No projects yet
									</div>
								)}
							</div>
						</>
					)}

					{/* Nav */}
					<div className="px-4 pb-2 text-xs uppercase tracking-[0.12em] text-[#5d6a78]">
						Navigation
					</div>
					{nav.map((n) => (
						<NavLink
							key={n.to}
							to={n.to}
							end={n.end}
							className={({ isActive }) =>
								cn(
									"mx-3 mb-1 flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm transition",
									isActive
										? "border-black/10 bg-black/5 text-[#1f2a34]"
										: "border-black/10 text-[#5d6a78] hover:bg-black/5 hover:text-[#1f2a34]",
								)
							}
						>
							{n.label}
						</NavLink>
					))}
				</div>

				{/* ── MAIN ── */}
				<div className="min-w-0 flex-1 bg-[#eef3f6]">
					<div className="sticky top-0 z-10 flex items-center justify-end border-b border-black/10 bg-[#f8fafb]/90 px-6 py-3 backdrop-blur-sm">
						<div className="relative" ref={profileMenuRef}>
							<button
								type="button"
								onClick={() =>
									setProfileMenuOpen((prev) => !prev)
								}
								className="grid h-10 w-10 place-items-center rounded-full bg-[#1f2a34] font-semibold text-white ring-1 ring-black/10 transition hover:bg-[#2a3641]"
								aria-label="Open profile menu"
							>
								{initials}
							</button>

							{profileMenuOpen && (
								<div className="absolute right-0 top-12 w-56 rounded-xl border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(31,42,52,0.15)]">
									<div className="border-b border-black/10 pb-3">
										<div className="truncate text-sm font-semibold text-[#1f2a34]">
											{user?.full_name}
										</div>
										<div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#5d6a78]">
											{user?.role}
										</div>
									</div>
									<button
										type="button"
										onClick={doLogout}
										className="mt-3 w-full rounded-lg border border-black/10 bg-[#f7f8fa] px-3 py-2 text-sm font-medium text-[#475462] transition hover:bg-black/5 hover:text-[#1f2a34]"
									>
										Sign Out
									</button>
								</div>
							)}
						</div>
					</div>
					<div className="min-h-0 overflow-x-hidden">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
}
