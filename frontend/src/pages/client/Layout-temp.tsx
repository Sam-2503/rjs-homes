import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function ClientLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

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

	const nav = [
		{ to: "/client", label: "Overview", end: true },
		{ to: "/client/progress", label: "Progress" },
		{ to: "/client/updates", label: "Updates" },
		{ to: "/client/queries", label: "Questions" },
	];

	return (
		<div className="flex min-h-screen w-full bg-[radial-gradient(120%_90%_at_50%_0%,#13263a_0%,#08111c_48%,#050911_100%)] text-white">
			{/* ── SIDEBAR ── */}
			<div className="flex w-[280px] shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-[#0a121c]/80 to-[#050911]/80 backdrop-blur-xl">
				{/* Logo */}
				<div className="mb-6 border-b border-white/10 px-4 py-6">
					<img
						src="/rjs-logo.svg"
						className="h-12 w-12 rounded-full border border-[#d5b47a]/40 bg-[radial-gradient(circle_at_30%_25%,#e4cda2_0%,#b68945_60%,#7a5a2e_100%)] shadow-[0_8px_24px_rgba(182,137,69,0.35)]"
					/>

					<div>
						<div className="text-lg font-semibold text-[#f5efe2]">
							RJS Homes
						</div>
						<div className="text-[10px] uppercase tracking-[0.12em] text-[#a9b7c8]">
							Client Portal
						</div>
					</div>
				</div>

				{/* Logged-in user */}
				<div className="mx-4 mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
					<div className="grid h-10 w-10 place-items-center rounded-full bg-[#d8bc8f] font-semibold text-[#101824]">
						{initials}
					</div>
					<div>
						<div className="text-sm font-medium text-white">
							{user?.full_name}
						</div>
						<div className="text-[10px] uppercase text-[#a9b7c8]">
							{user?.role}
						</div>
					</div>
				</div>

				{/* Nav */}
				<div className="px-4 pb-2 text-[10px] uppercase tracking-[0.12em] text-[#a9b7c8]">
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
									? "border-[#d8bc8f]/35 bg-[rgba(216,188,143,0.08)] text-[#d8bc8f]"
									: "border-white/10 text-[#c0ccd8] hover:border-[#d8bc8f]/25 hover:bg-white/5 hover:text-[#f0e0c1]",
							)
						}
					>
						{n.label}
					</NavLink>
				))}

				<div className="mt-auto border-t border-white/10 p-4">
					<button
						className="w-full rounded-xl border border-red-900/40 bg-[rgba(220,76,69,0.08)] px-3 py-2 text-sm font-medium text-red-300/80 transition hover:border-red-700/60 hover:bg-[rgba(220,76,69,0.12)] hover:text-red-200"
						onClick={doLogout}
					>
						Sign Out
					</button>
				</div>
			</div>

			{/* ── MAIN ── */}
			<div className="relative min-w-0 flex-1 overflow-x-hidden bg-[radial-gradient(120%_90%_at_50%_100%,#13263a_0%,#08111c_48%,#050911_100%)]">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_84%_10%,rgba(216,188,143,0.08)_0%,transparent_60%),radial-gradient(55%_45%_at_12%_30%,rgba(93,126,161,0.12)_0%,transparent_70%)]" />
				<Outlet />
			</div>
		</div>
	);
}
