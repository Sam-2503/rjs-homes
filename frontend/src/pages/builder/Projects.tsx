import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useToast } from "../../components/Toast";
import { cn } from "../../utils/cn";
import type {
	Project,
	ProjectStatus,
	User,
	CreateProjectRequest,
} from "../../types";

const STATUS_COLOR: Record<ProjectStatus, string> = {
	planning: "var(--gray)",
	in_progress: "#c7ced6",
	on_hold: "#c7ced6",
	completed: "#c7ced6",
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
	planning: "Planning",
	in_progress: "Active",
	on_hold: "On Hold",
	completed: "Complete",
};

const STATUS_BADGE: Record<ProjectStatus, string> = {
	planning: "bg-[#eef3f6] text-[#475462]",
	in_progress: "bg-[#eef3f6] text-[#475462]",
	on_hold: "bg-[#eef3f6] text-[#475462]",
	completed: "bg-[#eef3f6] text-[#475462]",
};

const EMPTY: CreateProjectRequest = {
	name: "",
	description: null,
	location: null,
	client_id: "",
	start_date: null,
	expected_end_date: null,
};

export default function BuilderProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [clients, setClients] = useState<User[]>([]);
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<CreateProjectRequest>(EMPTY);
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(true);
	const toast = useToast();
	const navigate = useNavigate();

	const load = async () => {
		setLoading(true);
		try {
			const [pRes, cRes] = await Promise.all([
				api.get<Project[]>("/api/projects/"),
				api
					.get<User[]>("/api/users/clients")
					.catch(() => ({ data: [] as User[] })),
			]);
			setProjects(pRes.data);
			setClients(cRes.data);
		} catch {
			toast("Failed to load data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const set =
		(k: keyof CreateProjectRequest) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>,
		) =>
			setForm((f) => ({ ...f, [k]: e.target.value || null }));

	const create = async () => {
		if (!form.name) {
			toast("Project name is required");
			return;
		}
		if (!form.client_id) {
			toast("Please select a client");
			return;
		}
		setSaving(true);
		try {
			await api.post("/api/projects/", form);
			toast("Project created successfully");
			setOpen(false);
			setForm(EMPTY);
			load();
		} catch (e: any) {
			toast(e?.response?.data?.detail ?? "Failed to create project");
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			{/* Topbar */}
			<div className="flex items-center justify-between border-b border-black/10 bg-[rgba(224,234,242,0.3)] px-6 py-4">
				<div className="text-2xl font-semibold text-[#1f2a34]">
					Projects
				</div>
				<div className="flex items-center gap-3">
					<button
						className="rounded bg-[#1f2a34] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#2a3641]"
						onClick={() => setOpen(true)}
					>
						+ New Project
					</button>
				</div>
			</div>

			<div className="animate-fade-up px-6 py-6">
				{loading ? (
					<div className="rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] p-10 text-center">
						<div className="mx-auto mb-2 loading-spinner" />
						<div className="text-sm text-[#5d6a78]">Loading…</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
						{projects.map((p) => (
							<div
								key={p.id}
								className="cursor-pointer rounded-md border border-black/10 border-t-2 bg-[rgba(224,234,242,0.3)] p-4 transition hover:border-black/20"
								style={{
									borderTopColor: STATUS_COLOR[p.status],
								}}
								onClick={() =>
									navigate(`/builder/projects/${p.id}`)
								}
							>
								<div className="space-y-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<div className="text-sm font-semibold text-[#1f2a34]">
												{p.name}
											</div>
											<div className="text-xs text-[#888888]">
												{p.location ?? "Location TBD"}
											</div>
										</div>
										<span
											className={cn(
												"rounded px-2 py-0.5 text-[0.65rem] font-semibold uppercase",
												STATUS_BADGE[p.status],
											)}
										>
											{STATUS_LABEL[p.status]}
										</span>
									</div>

									<div className="text-xs text-[#5d6a78]">
										{p.location ?? "—"}
									</div>

									<div>
										<div className="mb-1 flex items-center justify-between text-[0.7rem] text-[#5d6a78]">
											<span>Progress</span>
											<span>{p.overall_progress}%</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded bg-black/10">
											<div
												className="h-full rounded"
												style={{
													width: `${p.overall_progress}%`,
													background:
														STATUS_COLOR[p.status],
												}}
											/>
										</div>
									</div>
								</div>

								<div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
									<div className="text-[0.72rem] text-[#5d6a78]">
										Status:{" "}
										<span className="text-[#475462]">
											{STATUS_LABEL[p.status]}
										</span>
									</div>
									<div className="text-[0.68rem] text-[#888888]">
										{p.expected_end_date
											? "Due: " +
												new Date(
													p.expected_end_date,
												).toLocaleDateString("en-IN", {
													month: "short",
													year: "numeric",
												})
											: "—"}
									</div>
								</div>
							</div>
						))}

						{/* Add card */}
						<div
							className="grid cursor-pointer place-items-center rounded-md border border-dashed border-black/15 bg-[rgba(224,234,242,0.3)] p-6 text-center transition hover:bg-black/5"
							onClick={() => setOpen(true)}
						>
							<div className="mb-2 text-2xl text-[#1f2a34]">
								＋
							</div>
							<div className="text-sm font-medium text-[#5d6a78]">
								Create New Project
							</div>
						</div>
					</div>
				)}
			</div>

			{/* ── CREATE PROJECT MODAL ── */}
			<div
				className={cn(
					"fixed inset-0 z-[1000] grid place-items-center bg-black/65 p-4 backdrop-blur-sm transition",
					open ? "visible opacity-100" : "invisible opacity-0",
				)}
				onClick={(e) => e.target === e.currentTarget && setOpen(false)}
			>
				<div className="w-full max-w-[520px] rounded-[12px] border border-black/10 bg-[#dfe7ec] shadow-2xl">
					<div className="p-6">
						<div className="mb-6 flex items-start justify-between">
							<div>
								<div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6977]">
									Create Project
								</div>
								<h2 className="mt-2 font-semibold text-[#1f2a34] text-xl">
									New Project
								</h2>
								<p className="mt-2 max-w-[420px] text-sm text-[#556372]">
									Fill in the project details below
								</p>
							</div>
							<button
								className="rounded border border-black/10 px-2 py-1 text-sm text-[#5d6a78] transition hover:border-black/20 hover:text-[#1f2a34]"
								onClick={() => setOpen(false)}
							>
								✕
							</button>
						</div>

						<form className="grid gap-3 rounded-[10px] border border-black/10 bg-white p-5">
							<input
								type="text"
								className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none"
								placeholder="Project name"
								value={form.name}
								onChange={(e) =>
									setForm((f) => ({
										...f,
										name: e.target.value,
									}))
								}
							/>

							<textarea
								className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none"
								rows={4}
								placeholder="Project description"
								value={form.description ?? ""}
								onChange={set("description")}
							/>

							<input
								type="text"
								className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none"
								placeholder="Project location"
								value={form.location ?? ""}
								onChange={set("location")}
							/>

							{clients.length === 0 ? (
								<div className="rounded-md border border-black/15 px-3 py-2 text-xs text-[#888888]">
									No clients registered yet. Ask client to
									register first.
								</div>
							) : (
								<select
									className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none"
									value={form.client_id}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											client_id: e.target.value,
										}))
									}
								>
									<option value="">Select client…</option>
									{clients.map((c) => (
										<option key={c.id} value={c.id}>
											{c.full_name} — {c.email}
										</option>
									))}
								</select>
							)}

							<div className="grid grid-cols-2 gap-3">
								<input
									type="date"
									className="rounded-md border border-black/15 px-3 py-2 text-sm outline-none"
									value={form.start_date ?? ""}
									onChange={set("start_date")}
								/>
								<input
									type="date"
									className="rounded-md border border-black/15 px-3 py-2 text-sm outline-none"
									value={form.expected_end_date ?? ""}
									onChange={set("expected_end_date")}
								/>
							</div>

							<button
								type="button"
								className="rounded-full bg-[#1e2a35] px-5 py-2 text-xs font-semibold uppercase tracking-[0.09em] text-white"
								onClick={create}
								disabled={saving}
							>
								{saving ? "Creating…" : "Submit inquiry"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
