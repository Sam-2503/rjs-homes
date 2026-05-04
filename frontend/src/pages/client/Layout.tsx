import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function ClientLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);
	const profileMenuRef = useRef<HTMLDivElement | null>(null);

	const initials =
		user?.full_name
			?.split(" ")
			.map((w) => w[0])
			.join("")
			.toUpperCase()
			.slice(0, 2) ?? "C";

	const doLogout = () => {
		logout();
		navigate("/login");
	};

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

	const nav = [
		{ to: "/client", label: "Overview", end: true },
		{ to: "/client/progress", label: "Progress" },
		{ to: "/client/updates", label: "Updates" },
		{ to: "/client/queries", label: "Questions" },
	];

	return (
		<>
			<title>RJS Homes - Client Portal</title>
			<div className="flex min-h-screen w-full bg-[#eef3f6] text-[#1f2a34]">
				{/* ── SIDEBAR ── */}
				<div className="flex w-[280px] shrink-0 flex-col border-r border-black/10 bg-[#f8fafb] backdrop-blur-xl">
					{/* Logo */}
					<div className="flex mb-6 border-b border-black/10 px-4 py-6">
						<img
							src="/rjs-logo.svg"
							className="h-12 w-12 rounded-full border border-[#d5b47a]/40 bg-[radial-gradient(circle_at_30%_25%,#e4cda2_0%,#b68945_60%,#7a5a2e_100%)] shadow-[0_8px_24px_rgba(182,137,69,0.35)]"
						/>
						<div>
							<div className="pl-8 font-serif text-lg font-semibold text-[#1f2a34]">
								RJS Homes
							</div>
							<div className="pl-8 text-[10px] uppercase tracking-[0.12em] text-[#5d6a78]">
								Client Portal
							</div>
						</div>
					</div>

					{/* Nav */}
					<div className="px-4 pb-2 text-[10px] uppercase tracking-[0.12em] text-[#5d6a78]">
						Navigation
					</div>
					{nav.map((n) => (
						<NavLink
							key={n.to}
							to={n.to}
							end={n.end}
							className={({ isActive }) =>
								cn(
									"mx-3 mb-1 flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition",
									isActive
										? "border-black/10 bg-black/5 text-[#1f2a34]"
										: "border-black/10 text-[#475462] hover:bg-black/5 hover:text-[#1f2a34]",
								)
							}
						>
							{n.label}
						</NavLink>
					))}
				</div>

				{/* ── MAIN ── */}
				<div className="relative min-w-0 flex-1 bg-[#eef3f6]">
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
