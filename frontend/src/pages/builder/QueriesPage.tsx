import { useState, useEffect } from "react";
import { Card, useToast, QueryList, QueryResponseForm } from "../../components";
import api from "../../api/client";
import type { Query, RespondToQueryRequest } from "../../types";
import { cn } from "../../utils/cn";

export default function QueriesPage() {
	const [queries, setQueries] = useState<Query[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
	const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
	const toast = useToast();

	const loadQueries = async () => {
		setLoading(true);
		try {
			const res = await api.get<Query[]>("/api/queries");
			setQueries(res.data);
		} catch {
			toast("Failed to load queries");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadQueries();
	}, []);

	const handleRespond = async (response: RespondToQueryRequest) => {
		if (!selectedQuery) return;

		try {
			await api.post(
				`/api/queries/${selectedQuery.id}/respond`,
				response,
			);
			toast("Response submitted successfully");
			await loadQueries();
			setSelectedQuery(null);
		} catch (err: any) {
			toast(err?.response?.data?.detail || "Failed to submit response");
		}
	};

	const filteredQueries = queries.filter((q) => {
		if (filter === "all") return true;
		return q.status === filter;
	});

	const statusCounts = {
		all: queries.length,
		open: queries.filter((q) => q.status === "open").length,
		resolved: queries.filter((q) => q.status === "resolved").length,
	};

	return (
		<div className="space-y-6 px-6 py-6">
			{/* Header */}
			<div>
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold text-[#1f2a34]">
						Client Questions
					</h1>
					<p className="text-sm text-[#5d6a78]">
						Respond to client questions about projects
					</p>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="flex gap-3 overflow-x-auto border-b-2 border-black/10 pb-0">
				<button
					className={cn(
						"mb-[-2px] border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5d6a78] transition hover:text-brand-gold",
						filter === "all" && "border-brand-gold text-brand-gold",
					)}
					onClick={() => setFilter("all")}
				>
					All ({statusCounts.all})
				</button>
				<button
					className={cn(
						"mb-[-2px] border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5d6a78] transition hover:text-brand-gold",
						filter === "open" &&
							"border-brand-gold text-brand-gold",
					)}
					onClick={() => setFilter("open")}
				>
					Open ({statusCounts.open})
				</button>
				<button
					className={cn(
						"mb-[-2px] border-b-2 border-transparent px-4 py-3 text-sm font-medium text-[#5d6a78] transition hover:text-brand-gold",
						filter === "resolved" &&
							"border-brand-gold text-brand-gold",
					)}
					onClick={() => setFilter("resolved")}
				>
					Resolved ({statusCounts.resolved})
				</button>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				{/* Queries List */}
				<div className="space-y-4">
					<QueryList
						queries={filteredQueries}
						loading={loading}
						onSelect={setSelectedQuery}
					/>
				</div>

				{/* Response Form (if query selected) */}
				{selectedQuery && (
					<div className="space-y-4 xl:sticky xl:top-6">
						<Card className="border border-black/10 bg-black/5 p-3">
							<button
								className="w-full rounded border border-black/10 px-4 py-3 text-sm font-medium text-[#5d6a78] transition hover:border-brand-gold hover:text-brand-gold"
								onClick={() => setSelectedQuery(null)}
							>
								← Back to List
							</button>
						</Card>
						<QueryResponseForm
							query={selectedQuery}
							onSubmit={handleRespond}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
