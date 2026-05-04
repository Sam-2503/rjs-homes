import React from "react";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
	title?: string;
	subtitle?: string;
	actions?: React.ReactNode;
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
	const { user } = useAuth();

	const getInitials = (fullName: string) => {
		return fullName
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="flex shrink-0 items-center justify-between border-b border-brand-border bg-brand-card px-6 py-5">
			<div className="flex-1">
				{title && (
					<h1 className="text-[1.75rem] font-semibold text-white">
						{title}
					</h1>
				)}
				{subtitle && (
					<p className="text-[0.72rem] text-[#777]">{subtitle}</p>
				)}
			</div>

			<div className="ml-auto flex items-center gap-6">
				{actions && (
					<div className="flex items-center gap-4">{actions}</div>
				)}
				{user && (
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-gold text-sm font-bold text-brand-black">
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
			</div>
		</div>
	);
}
