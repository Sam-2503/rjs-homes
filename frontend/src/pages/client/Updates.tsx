import { useEffect, useState } from "react";
import api from "../../api/client";
import { useToast } from "../../components/Toast";
import type { Update, WorkCategory } from "../../types";

const CATS: { v: WorkCategory; l: string }[] = [
	{ v: "foundation", l: "Foundation" },
	{ v: "framing", l: "Framing" },
	{ v: "roofing", l: "Roofing" },
	{ v: "plumbing", l: "Plumbing" },
	{ v: "electrical", l: "Electrical" },
	{ v: "painting", l: "Painting" },
	{ v: "flooring", l: "Flooring" },
	{ v: "windows_doors", l: "Windows & Doors" },
	{ v: "finishing", l: "Finishing" },
	{ v: "other", l: "Other" },
];

export default function ClientUpdates() {
	const [recentUpdates, setRecentUpdates] = useState<Update[]>([]);
	const [loading, setLoading] = useState(true);
	const [categoryFilter, setCategoryFilter] = useState<WorkCategory | "all">(
		"all",
	);
	const toast = useToast();

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const response = await api.get<Update[]>("/api/updates");
				setRecentUpdates(response.data);
			} catch {
				toast("Failed to load updates");
			} finally {
				setLoading(false);
			}
		};

		load();
	}, []);

	const filteredUpdates = recentUpdates.filter((u) => {
		if (categoryFilter !== "all") {
			return u.category === categoryFilter;
		}
		return true;
	});

	return (
		<>
			<div className="border-b border-black/10 bg-[#f8fafb] px-6 py-8 backdrop-blur-sm">
				<h1 className="text-4xl font-bold text-[#1f2a34]">
					Project Updates
				</h1>
				<p className="mt-2 text-[#5d6a78]">
					View-only project progress updates
				</p>
			</div>

			<div className="animate-fade-up space-y-6 px-6 py-8">
				<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] p-5 backdrop-blur-sm">
					<div className="mb-4 border-b border-black/10 pb-4 text-lg font-semibold text-[#1f2a34]">
						Filter Updates
					</div>
					<div>
						<label
							htmlFor="category-filter"
							className="mb-3 block text-sm font-semibold uppercase tracking-[0.1em] text-[#5d6a78]"
						>
							Work Category
						</label>
						<select
							id="category-filter"
							className="w-full rounded-xl border border-black/10 bg-[rgba(224,234,242,0.5)] px-4 py-3 text-sm text-[#1f2a34] outline-none transition placeholder:text-[#5d6a78] focus:border-[#fbbf24]/35 focus:bg-[rgba(224,234,242,0.7)]"
							value={categoryFilter}
							onChange={(e) =>
								setCategoryFilter(
									e.target.value as WorkCategory | "all",
								)
							}
						>
							<option value="all">All Categories</option>
							{CATS.map((c) => (
								<option key={c.v} value={c.v}>
									{c.l}
								</option>
							))}
						</select>
					</div>
				</div>

				{loading ? (
					<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] px-8 py-12 text-center backdrop-blur-sm">
						<div className="text-sm text-[#5d6a78]">
							Loading updates…
						</div>
					</div>
				) : filteredUpdates.length === 0 ? (
					<div className="rounded-2xl border border-black/10 bg-[rgba(224,234,242,0.3)] px-8 py-12 text-center backdrop-blur-sm">
						<div className="text-sm text-[#5d6a78]">
							No updates available yet
						</div>
						<div className="mt-2 text-xs text-[#8b9ba9]">
							Check back soon for project progress
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{filteredUpdates.map((u) => {
							const isComplete = u.progress_percentage >= 100;
							return (
								<div
									key={u.id}
									className={`flex gap-4 rounded-2xl border p-5 backdrop-blur-sm ${
										isComplete
											? "border-[#10b981]/30 bg-[rgba(16,185,129,0.08)]"
											: "border-[#fbbf24]/30 bg-[rgba(251,191,36,0.08)]"
									}`}
								>
									<div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-black/5 text-sm font-medium text-[#fbbf24]">
										●
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-lg font-semibold text-[#1f2a34]">
											{u.title}
										</div>
										{u.description && (
											<div className="line-clamp-2 mt-1 text-sm leading-6 text-[#5d6a78]">
												{u.description}
											</div>
										)}
										<div className="mt-3 flex flex-wrap gap-2 text-xs">
											<span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 font-medium uppercase tracking-[0.05em] text-[#475462]">
												{u.category.replace("_", " ")}
											</span>
											<span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 font-medium text-[#fbbf24]">
												{u.progress_percentage}%
												complete
											</span>
											{u.photo_urls.length > 0 && (
												<span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 font-medium text-[#3b82f6]">
													{u.photo_urls.length}{" "}
													{u.photo_urls.length > 1
														? "photos"
														: "photo"}
												</span>
											)}
										</div>
										<div className="mt-3 text-xs text-[#8b9ba9]">
											{new Date(
												u.created_at,
											).toLocaleString("en-IN", {
												day: "2-digit",
												month: "short",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</>
	);
}
