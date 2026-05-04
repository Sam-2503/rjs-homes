import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
	label: string;
	path: string;
	icon?: string;
}

interface SidebarProps {
	navItems: NavItem[];
	title?: string;
	subtitle?: string;
	logo?: string;
}

export default function Sidebar({
	navItems,
	title = "RJS",
	subtitle = "Homes",
	logo,
}: SidebarProps) {
	const { user, logout } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const getInitials = (fullName: string) => {
		return fullName
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="flex h-full w-[220px] shrink-0 flex-col overflow-x-hidden overflow-y-auto border-r border-brand-border bg-brand-black">
			{/* Logo */}
			<div className="flex shrink-0 items-center gap-2.5 border-b border-brand-border px-4 pb-3 pt-4">
				{logo ? (
					<img
						src={logo}
						alt="Logo"
						className="h-[30px] w-[30px] object-contain"
					/>
				) : (
					<div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center bg-brand-gold text-base font-bold text-brand-black">
						{title.slice(0, 1)}
					</div>
				)}
				<div>
					<div className="text-base font-bold leading-tight text-white">
						{title}
					</div>
					<div className="text-[0.65rem] uppercase tracking-[0.1em] text-[#777]">
						{subtitle}
					</div>
				</div>
			</div>

			{/* User Info */}
			{user && (
				<div className="flex shrink-0 items-center gap-2.5 border-b border-brand-border px-4 py-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-gold text-sm font-bold text-brand-black">
						{getInitials(user.full_name)}
					</div>
					<div>
						<div className="text-sm font-semibold leading-tight text-white">
							{user.full_name}
						</div>
						<div className="text-[0.65rem] uppercase tracking-[0.06em] text-[#777]">
							{user.role}
						</div>
					</div>
				</div>
			)}

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto py-3">
				{navItems.map((item) => (
					<Link
						key={item.path}
						to={item.path}
						className={`flex items-center gap-3 border-l-[3px] px-4 py-3 text-sm transition-all duration-300 ${
							location.pathname === item.path
								? "border-l-brand-gold bg-[rgba(200,151,31,0.08)] text-white"
								: "border-l-transparent text-brand-muted-light hover:bg-white/5 hover:text-white"
						}`}
					>
						{item.icon && (
							<span className="inline-flex items-center justify-center">
								{item.icon}
							</span>
						)}
						<span className="flex-1">{item.label}</span>
					</Link>
				))}
			</nav>

			{/* Logout */}
			<div className="shrink-0 border-t border-brand-border p-4">
				<button
					className="w-full rounded-md border border-[rgba(192,57,43,0.3)] bg-[rgba(192,57,43,0.1)] px-4 py-3 text-xs font-semibold text-[#c0392b] transition-all duration-300 hover:border-[rgba(192,57,43,0.5)] hover:bg-[rgba(192,57,43,0.2)]"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
