import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useToast } from "../../components/Toast";
import { cn } from "../../utils/cn";
import type {
	Project,
	Update,
	Material,
	Query,
	ProjectStatus,
	WorkCategory,
	MaterialType,
	CreateUpdateRequest,
} from "../../types";

const STATUS_LABEL: Record<ProjectStatus, string> = {
	planning: "Planning",
	in_progress: "Active",
	on_hold: "On Hold",
	completed: "Complete",
};
const STATUSES: ProjectStatus[] = [
	"planning",
	"in_progress",
	"on_hold",
	"completed",
];

const CAT_IC: Record<WorkCategory, string> = {
	foundation: "🏗",
	framing: "🪵",
	roofing: "🏠",
	plumbing: "💧",
	electrical: "⚡",
	painting: "🎨",
	flooring: "🪨",
	windows_doors: "🚪",
	finishing: "✨",
	other: "📋",
};
const CATS: { v: WorkCategory; l: string }[] = [
	{ v: "foundation", l: "🏗 Foundation" },
	{ v: "framing", l: "🪵 Framing" },
	{ v: "roofing", l: "🏠 Roofing" },
	{ v: "plumbing", l: "💧 Plumbing" },
	{ v: "electrical", l: "⚡ Electrical" },
	{ v: "painting", l: "🎨 Painting" },
	{ v: "flooring", l: "🪨 Flooring" },
	{ v: "windows_doors", l: "🚪 Windows & Doors" },
	{ v: "finishing", l: "✨ Finishing" },
	{ v: "other", l: "📋 Other" },
];
const MAT_TYPES: MaterialType[] = [
	"lumber",
	"cement",
	"bricks",
	"steel",
	"paint",
	"tiles",
	"plumbing_pipes",
	"electrical_wire",
	"glass",
	"sand",
	"gravel",
	"other",
];

const EMPTY_UPD: CreateUpdateRequest = {
	title: "",
	description: null,
	category: "other",
	progress_percentage: 0,
	photo_urls: [],
	project_id: "",
};

interface MaterialForm {
	material_type: MaterialType;
	name: string;
	quantity: string;
	unit: string;
	unit_cost: string;
	supplier: string | null;
}

const EMPTY_MAT: MaterialForm = {
	material_type: "lumber",
	name: "",
	quantity: "",
	unit: "",
	unit_cost: "",
	supplier: null,
};

type Tab = "updates" | "materials" | "queries" | "info";

export default function BuilderProjectDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const [project, setProject] = useState<Project | null>(null);
	const [updates, setUpdates] = useState<Update[]>([]);
	const [materials, setMaterials] = useState<Material[]>([]);
	const [queries, setQueries] = useState<Query[]>([]);
	const [tab, setTab] = useState<Tab>("updates");
	const [lastError, setLastError] = useState<string>("");

	const [showUpd, setShowUpd] = useState(false);
	const [showMat, setShowMat] = useState(false);
	const [showQueryResponse, setShowQueryResponse] = useState<string | null>(
		null,
	);
	const [updForm, setUpdForm] = useState<CreateUpdateRequest>(EMPTY_UPD);
	const [matForm, setMatForm] = useState(EMPTY_MAT);
	const [queryResponseText, setQueryResponseText] = useState("");
	const [queryResponseMediaUrls, setQueryResponseMediaUrls] = useState<
		string[]
	>([]);
	const [uploadingQueryMedia, setUploadingQueryMedia] = useState(false);
	const [photoIn, setPhotoIn] = useState("");
	const [uploadingPhoto, setUploadingPhoto] = useState(false);
	const [saving, setSaving] = useState(false);

	const load = async () => {
		if (!id) {
			console.log("No project ID");
			setLastError("No project ID");
			return;
		}
		try {
			console.log("Loading project:", id);
			const token = localStorage.getItem("rjs_token");
			console.log("Token present:", !!token);
			if (token) console.log("Token:", token.substring(0, 30) + "...");

			// Load each endpoint separately to identify which one fails
			console.log("Calling /api/projects/" + id);
			const projRes = await api.get<Project>(`/api/projects/${id}`);
			console.log("✓ Project loaded:", projRes.data);

			const [uR, mR, qR] = await Promise.all([
				api.get<Update[]>(`/api/updates/${id}`).catch((e) => {
					console.warn(
						"Updates load error:",
						e?.response?.status,
						e?.message,
					);
					return { data: [] };
				}),
				api.get<Material[]>(`/api/materials/${id}`).catch((e) => {
					console.warn(
						"Materials load error:",
						e?.response?.status,
						e?.message,
					);
					return { data: [] };
				}),
				api.get<Query[]>(`/api/queries?project_id=${id}`).catch((e) => {
					console.warn(
						"Queries load error:",
						e?.response?.status,
						e?.message,
					);
					return { data: [] };
				}),
			]);

			console.log("✓ All data loaded, setting state...");
			setProject(projRes.data);
			setUpdates(uR.data);
			setMaterials(mR.data);
			setQueries(qR.data);
			setLastError("");
			console.log("✓ State updated, component should render");
		} catch (e: any) {
			const errMsg =
				e?.response?.data?.detail || e?.message || "Unknown error";
			setLastError(errMsg);
			console.error("Failed to load project - Error:", errMsg);
			console.error("Status:", e?.response?.status);
			console.error("Full response:", e?.response?.data);
			toast(errMsg);
		}
	};

	useEffect(() => {
		load();
	}, [id]);

	const addPhoto = () => {
		const u = photoIn.trim();
		if (u) {
			setUpdForm((f) => ({ ...f, photo_urls: [...f.photo_urls, u] }));
			setPhotoIn("");
		}
	};

	const handlePhotoUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadingPhoto(true);
		try {
			const { updateService } =
				await import("../../api/services/updates");
			const result = await updateService.uploadImage(file);
			setUpdForm((f) => ({
				...f,
				photo_urls: [...f.photo_urls, result.url],
			}));
			toast("Image uploaded ✓");
		} catch (err: any) {
			toast(err?.response?.data?.detail ?? "Failed to upload image");
		} finally {
			setUploadingPhoto(false);
			e.target.value = "";
		}
	};

	const postUpdate = async () => {
		if (!updForm.title) {
			toast("Title is required");
			return;
		}
		setSaving(true);
		console.log("Posting update...");
		try {
			const res = await api.post("/api/updates/", {
				...updForm,
				project_id: id,
			});
			console.log("✓ Update posted successfully:", res.data);
			toast("Update posted ✓");
			console.log("Resetting form and closing modal...");
			setUpdForm(EMPTY_UPD);
			setShowUpd(false);
			console.log("Modal should be closed now. Loading fresh data...");
			await load();
			console.log("✓ Load complete, modal should stay closed");
		} catch (e: any) {
			console.error("✗ Failed to post update:", e);
			toast(e?.response?.data?.detail ?? "Failed");
		} finally {
			setSaving(false);
		}
	};

	const addMaterial = async () => {
		if (!matForm.name || !matForm.quantity || !matForm.unit_cost) {
			toast("Name, quantity and unit cost are required");
			return;
		}
		setSaving(true);
		try {
			await api.post("/api/materials/", {
				...matForm,
				project_id: id,
				quantity: parseFloat(matForm.quantity),
				unit_cost: parseFloat(matForm.unit_cost),
			});
			toast("Material logged ✓");
			setMatForm(EMPTY_MAT);
			setShowMat(false);
			await load();
		} catch (e: any) {
			toast(e?.response?.data?.detail ?? "Failed");
		} finally {
			setSaving(false);
		}
	};

	const respondToQuery = async (queryId: string) => {
		if (!queryResponseText.trim()) {
			toast("Response cannot be empty");
			return;
		}
		setSaving(true);
		try {
			await api.post(`/api/queries/${queryId}/respond`, {
				answer: queryResponseText.trim(),
				answer_media_urls: queryResponseMediaUrls,
			});
			toast("Response posted ✓");
			setQueryResponseText("");
			setQueryResponseMediaUrls([]);
			setShowQueryResponse(null);
			await load();
		} catch (e: any) {
			toast(e?.response?.data?.detail ?? "Failed to post response");
		} finally {
			setSaving(false);
		}
	};

	const handleQueryMediaUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploadingQueryMedia(true);
		try {
			const uploadedUrls: string[] = [];
			for (const file of Array.from(files)) {
				const formData = new FormData();
				formData.append("file", file);
				const response = await api.post<{ url: string }>(
					"/api/queries/upload-image",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					},
				);
				uploadedUrls.push(response.data.url);
			}
			setQueryResponseMediaUrls((prev) => [...prev, ...uploadedUrls]);
			toast("Response image uploaded ✓");
		} catch (e: any) {
			toast(e?.response?.data?.detail ?? "Failed to upload image");
		} finally {
			setUploadingQueryMedia(false);
			e.target.value = "";
		}
	};

	const setStatus = async (s: ProjectStatus) => {
		try {
			await api.patch(`/api/projects/${id}`, { status: s });
			toast("Status updated ✓");
			load();
		} catch {
			toast("Failed");
		}
	};

	const setProgress = async (v: string) => {
		try {
			await api.patch(`/api/projects/${id}`, {
				overall_progress: parseFloat(v),
			});
			load();
		} catch {}
	};

	if (!project)
		return (
			<>
				<div className="flex items-center justify-between border-b border-black/10 bg-[rgba(224,234,242,0.3)] px-6 py-4">
					<div className="text-2xl font-semibold text-[#1f2a34]">
						Loading Project…
					</div>
				</div>
				<div className="px-6 py-6">
					<div className="rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] p-10 text-center">
						<div className="mb-2 text-3xl">⏳</div>
						<div
							style={{
								marginTop: "1rem",
								fontSize: ".9rem",
								color: "var(--gray)",
							}}
						>
							Project ID: {id}
						</div>
						{lastError && (
							<div
								style={{
									color: "red",
									marginTop: "1rem",
									fontSize: ".9rem",
								}}
							>
								Error: {lastError}
							</div>
						)}
					</div>
				</div>
			</>
		);

	const totalCost = materials.reduce((a, m) => a + m.total_cost, 0);

	return (
		<>
			{/* Topbar */}
			<div className="flex items-center justify-between border-b border-black/10 bg-[rgba(224,234,242,0.3)] px-6 py-4">
				<div
					className="flex items-center gap-2 text-2xl font-semibold text-[#1f2a34]"
					style={{ display: "flex", alignItems: "center", gap: 10 }}
				>
					<span
						style={{ color: "var(--gray)", cursor: "pointer" }}
						onClick={() => navigate("/builder/projects")}
					>
						←
					</span>
					{project.name}
				</div>
				<div className="flex items-center gap-2">
					<span className="rounded bg-[#fbbf24] px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-brand-black">
						{STATUS_LABEL[project.status]}
					</span>
					<button
						className="rounded bg-[#fbbf24] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-black transition hover:bg-[#fbbf24]-light"
						onClick={() => setShowUpd(true)}
					>
						+ Post Update
					</button>
					<button
						className="rounded border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#5d6a78] transition hover:border-[#fbbf24] hover:text-[#f59e0b]"
						onClick={() => setShowMat(true)}
					>
						+ Material
					</button>
				</div>
			</div>

			<div className="animate-fade-up space-y-5 px-6 py-6">
				{/* KPIs */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-md border border-black/10 border-t-2 border-t-[#27ae60] bg-[rgba(224,234,242,0.3)] p-4">
						<div className="text-3xl text-[#4caf50]">
							{project.overall_progress}%
						</div>
						<div className="mt-1 text-sm font-medium text-[#1f2a34]">
							Overall Progress
						</div>
					</div>
					<div className="rounded-md border border-black/10 border-t-2 border-t-brand-gold bg-[rgba(224,234,242,0.3)] p-4">
						<div className="text-3xl text-[#f59e0b]">
							{updates.length}
						</div>
						<div className="mt-1 text-sm font-medium text-[#1f2a34]">
							Updates Posted
						</div>
					</div>
					<div className="rounded-md border border-black/10 border-t-2 border-t-brand-gold bg-[rgba(224,234,242,0.3)] p-4">
						<div className="text-3xl text-[#f59e0b]">
							{materials.length}
						</div>
						<div className="mt-1 text-sm font-medium text-[#1f2a34]">
							Materials Logged
						</div>
					</div>
					<div className="rounded-md border border-black/10 border-t-2 border-t-brand-gold bg-[rgba(224,234,242,0.3)] p-4">
						<div className="text-3xl text-[#f59e0b]">
							₹{(totalCost / 1000).toFixed(0)}K
						</div>
						<div className="mt-1 text-sm font-medium text-[#1f2a34]">
							Material Cost
						</div>
					</div>
				</div>

				{/* Progress + status control */}
				<div className="rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] p-4">
					<div className="mb-4 flex items-center justify-between gap-3">
						<div className="text-sm font-semibold uppercase tracking-[0.1em] text-[#5d6a78]">
							Overall Progress
						</div>
						<div
							style={{
								display: "flex",
								gap: 6,
								flexWrap: "wrap",
							}}
						>
							{STATUSES.map((s) => (
								<button
									key={s}
									onClick={() => setStatus(s)}
									style={{
										padding: "5px 12px",
										fontSize: ".68rem",
										cursor: "pointer",
										fontFamily: "'Jost',sans-serif",
										letterSpacing: ".06em",
										textTransform: "uppercase",
										transition: ".15s",
										background:
											project.status === s
												? "var(--gold)"
												: "transparent",
										border:
											project.status === s
												? "none"
												: "1px solid var(--border2)",
										color:
											project.status === s
												? "var(--black)"
												: "var(--gray)",
									}}
								>
									{STATUS_LABEL[s]}
								</button>
							))}
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-[0.72rem] text-[#5d6a78]">
							<span>{project.name}</span>
							<span>{project.overall_progress}%</span>
						</div>
						<div className="h-1.5 overflow-hidden rounded bg-brand-border">
							<div
								className="h-full rounded bg-[#fbbf24]"
								style={{
									width: `${project.overall_progress}%`,
								}}
							/>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							marginTop: 10,
						}}
					>
						<span
							style={{
								fontSize: ".67rem",
								letterSpacing: ".1em",
								textTransform: "uppercase",
								color: "var(--gold)",
							}}
						>
							Set:
						</span>
						<input
							type="range"
							min={0}
							max={100}
							step={5}
							value={project.overall_progress}
							onChange={(e) => setProgress(e.target.value)}
							style={{ flex: 1 }}
						/>
						<span
							style={{
								fontSize: ".85rem",
								color: "var(--gold)",
								minWidth: 36,
								fontFamily: "'Cormorant Garamond',serif",
							}}
						>
							{project.overall_progress}%
						</span>
					</div>
				</div>

				{/* Tabs */}
				<div className="mb-4 flex border-b border-black/10">
					{(
						[
							["updates", "📝 Updates"],
							["materials", "🪵 Materials"],
							["queries", "💬 Questions"],
							["info", "⚙ Info"],
						] as [Tab, string][]
					).map(([k, l]) => (
						<button
							key={k}
							onClick={() => setTab(k)}
							className={cn(
								"mb-[-1px] border-b-2 border-transparent px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition",
								tab === k
									? "border-[#fbbf24] text-[#f59e0b]"
									: "text-[#888888] hover:text-[#f59e0b]",
							)}
						>
							{l}
						</button>
					))}
				</div>

				{/* ── UPDATES TAB ── */}
				{tab === "updates" &&
					(updates.length === 0 ? (
						<div className="rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] p-10 text-center">
							<div className="mb-2 text-3xl">📝</div>
							<div className="text-sm text-[#5d6a78]">
								No updates yet. Click "+ Post Update" to add
								one.
							</div>
						</div>
					) : (
						<div className="space-y-3">
							{updates.map((u) => (
								<div
									key={u.id}
									className={`flex gap-3 rounded-md border p-4 ${u.progress_percentage >= 100 ? "border-[#27ae60] bg-[rgba(39,174,96,0.08)]" : "border-[#fbbf24] bg-[rgba(200,151,31,0.08)]"}`}
								>
									<div className="grid h-9 w-9 place-items-center rounded bg-black/5">
										{CAT_IC[u.category]}
									</div>
									<div style={{ flex: 1 }}>
										<div className="text-sm font-medium text-[#1f2a34]">
											{u.title}
										</div>
										{u.description && (
											<div className="mt-1 text-[0.78rem] text-[#5d6a78]">
												{u.description}
											</div>
										)}
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: 8,
												marginTop: 6,
												flexWrap: "wrap",
											}}
										>
											<span className="rounded bg-black/5-light px-2 py-0.5 text-[0.58rem] uppercase text-[#5d6a78]">
												{u.category.replace("_", " ")}
											</span>
											<span
												style={{
													fontSize: ".7rem",
													color: "var(--gold)",
												}}
											>
												{u.progress_percentage}%
												complete
											</span>
											{u.photo_urls.length > 0 && (
												<span
													style={{
														fontSize: ".7rem",
														color: "var(--blue)",
													}}
												>
													📸 {u.photo_urls.length}{" "}
													photo
													{u.photo_urls.length > 1
														? "s"
														: ""}
												</span>
											)}
										</div>
										<div className="mt-2 text-[0.68rem] text-[#888888]">
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
							))}
						</div>
					))}

				{/* ── MATERIALS TAB ── */}
				{tab === "materials" &&
					(materials.length === 0 ? (
						<div className="rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] p-10 text-center">
							<div className="mb-2 text-3xl">🪵</div>
							<div className="text-sm text-[#5d6a78]">
								No materials logged yet. Click "+ Material" to
								add one.
							</div>
						</div>
					) : (
						<div className="overflow-hidden rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)]">
							<table className="min-w-full text-left text-sm">
								<thead>
									<tr>
										<th>Material</th>
										<th>Type</th>
										<th>Qty</th>
										<th>Unit Cost</th>
										<th>Total</th>
										<th>Supplier</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									{materials.map((m) => (
										<tr key={m.id}>
											<td>{m.name}</td>
											<td>
												<span className="rounded bg-black/5-light px-2 py-0.5 text-[0.58rem] uppercase text-[#5d6a78]">
													{m.material_type.replace(
														"_",
														" ",
													)}
												</span>
											</td>
											<td>
												{m.quantity} {m.unit}
											</td>
											<td>
												₹{m.unit_cost.toLocaleString()}
											</td>
											<td
												style={{ color: "var(--gold)" }}
											>
												₹{m.total_cost.toLocaleString()}
											</td>
											<td>{m.supplier ?? "—"}</td>
											<td>
												{new Date(
													m.purchased_at,
												).toLocaleDateString("en-IN", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												})}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div
								style={{
									padding: "12px 20px",
									borderTop: "1px solid var(--border)",
									display: "flex",
									justifyContent: "flex-end",
									gap: 8,
									alignItems: "center",
								}}
							>
								<span
									style={{
										fontSize: ".78rem",
										color: "var(--gray)",
									}}
								>
									Total Material Cost:
								</span>
								<span
									style={{
										fontFamily:
											"'Cormorant Garamond',serif",
										fontSize: "1.2rem",
										color: "var(--gold)",
									}}
								>
									₹{totalCost.toLocaleString()}
								</span>
							</div>
						</div>
					))}

				{/* ── QUERIES TAB ── */}
				{tab === "queries" &&
					(queries.length === 0 ? (
						<div className="rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] p-10 text-center">
							<div className="mb-2 text-3xl">💬</div>
							<div className="text-sm text-[#5d6a78]">
								No questions yet
							</div>
						</div>
					) : (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "1.5rem",
							}}
						>
							{queries.map((q) => (
								<div
									key={q.id}
									style={{
										padding: "1.5rem",
										background: "rgba(255, 255, 255, 0.03)",
										border: "1px solid var(--gray)",
										borderRadius: "8px",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "start",
											marginBottom: "1rem",
										}}
									>
										<h3
											style={{
												margin: "0 0 0.5rem 0",
												color: "var(--white)",
											}}
										>
											{q.question}
										</h3>
										<div
											style={{
												background:
													q.status === "resolved"
														? "var(--green)"
														: "var(--orange)",
												color: "var(--black)",
												padding: "0.25rem 0.75rem",
												borderRadius: "4px",
												fontSize: "0.85rem",
												fontWeight: "600",
												whiteSpace: "nowrap",
											}}
										>
											{q.status}
										</div>
									</div>

									{q.answer && (
										<div
											style={{
												padding: "1rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												borderLeft:
													"3px solid var(--gold)",
												borderRadius: "4px",
												marginBottom: "1rem",
											}}
										>
											<div
												style={{
													fontSize: "0.85rem",
													color: "var(--gray)",
													marginBottom: "0.5rem",
												}}
											>
												Your Response:
											</div>
											<div
												style={{
													color: "var(--white)",
												}}
											>
												{q.answer}
											</div>
											{(q.answer_media_urls ?? [])
												.length > 0 && (
												<div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
													{(
														q.answer_media_urls ??
														[]
													).map((url) => (
														<img
															key={url}
															src={url}
															alt="Query response media"
															className="h-24 w-full rounded-md object-cover"
														/>
													))}
												</div>
											)}
										</div>
									)}

									{!q.answer && (
										<>
											{showQueryResponse === q.id ? (
												<div
													style={{
														padding: "1rem",
														background:
															"rgba(255, 255, 255, 0.03)",
														border: "1px solid var(--gold)",
														borderRadius: "4px",
													}}
												>
													<textarea
														placeholder="Type your response..."
														value={
															queryResponseText
														}
														onChange={(e) =>
															setQueryResponseText(
																e.target.value,
															)
														}
														disabled={saving}
														style={{
															width: "100%",
															padding: "0.75rem",
															marginBottom:
																"1rem",
															background:
																"var(--input-bg)",
															border: "1px solid var(--gray)",
															borderRadius: "4px",
															color: "var(--white)",
															fontFamily:
																"inherit",
															fontSize: "0.95rem",
															minHeight: "80px",
															resize: "vertical",
														}}
													/>
													<div
														style={{
															marginBottom:
																"1rem",
														}}
													>
														<input
															type="file"
															accept="image/*"
															multiple
															onChange={
																handleQueryMediaUpload
															}
															disabled={
																saving ||
																uploadingQueryMedia
															}
															style={{
																color: "var(--white)",
															}}
														/>
														{uploadingQueryMedia && (
															<div
																style={{
																	fontSize:
																		".8rem",
																	color: "var(--gray)",
																	marginTop:
																		"0.5rem",
																}}
															>
																Uploading
																image...
															</div>
														)}
														{queryResponseMediaUrls.length >
															0 && (
															<div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
																{queryResponseMediaUrls.map(
																	(url) => (
																		<div
																			key={
																				url
																			}
																			className="relative overflow-hidden rounded-md border border-black/10"
																		>
																			<img
																				src={
																					url
																				}
																				alt="Selected response media"
																				className="h-24 w-full object-cover"
																			/>
																			<button
																				type="button"
																				onClick={() =>
																					setQueryResponseMediaUrls(
																						(
																							prev,
																						) =>
																							prev.filter(
																								(
																									item,
																								) =>
																									item !==
																									url,
																							),
																					)
																				}
																				className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white"
																			>
																				Remove
																			</button>
																		</div>
																	),
																)}
															</div>
														)}
													</div>
													<div
														style={{
															display: "flex",
															gap: "1rem",
														}}
													>
														<button
															onClick={() =>
																respondToQuery(
																	q.id,
																)
															}
															disabled={
																saving ||
																!queryResponseText.trim()
															}
															style={{
																padding:
																	"0.75rem 1.5rem",
																background:
																	"var(--gold)",
																color: "var(--black)",
																border: "none",
																borderRadius:
																	"4px",
																cursor: saving
																	? "not-allowed"
																	: "pointer",
																fontSize:
																	"0.95rem",
																fontWeight:
																	"600",
																opacity: saving
																	? 0.6
																	: 1,
															}}
														>
															{saving
																? "Posting..."
																: "Post Response"}
														</button>
														<button
															onClick={() => {
																setShowQueryResponse(
																	null,
																);
																setQueryResponseText(
																	"",
																);
																setQueryResponseMediaUrls(
																	[],
																);
															}}
															disabled={saving}
															style={{
																padding:
																	"0.75rem 1.5rem",
																background:
																	"transparent",
																color: "var(--gray)",
																border: "1px solid var(--gray)",
																borderRadius:
																	"4px",
																cursor: "pointer",
																fontSize:
																	"0.95rem",
															}}
														>
															Cancel
														</button>
													</div>
												</div>
											) : (
												<button
													onClick={() => {
														setShowQueryResponse(
															q.id,
														);
														setQueryResponseText(
															"",
														);
														setQueryResponseMediaUrls(
															[],
														);
													}}
													style={{
														padding:
															"0.75rem 1.5rem",
														background:
															"var(--gold)",
														color: "var(--black)",
														border: "none",
														borderRadius: "4px",
														cursor: "pointer",
														fontSize: "0.95rem",
														fontWeight: "600",
													}}
												>
													Respond
												</button>
											)}
										</>
									)}
								</div>
							))}
						</div>
					))}

				{/* ── INFO TAB ── */}
				{tab === "info" && (
					<div className="rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] p-4">
						<div className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#5d6a78]">
							Project Information
						</div>
						<div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
							{(
								[
									["Status", STATUS_LABEL[project.status]],
									["Location", project.location ?? "—"],
									[
										"Start Date",
										project.start_date
											? new Date(
													project.start_date,
												).toLocaleDateString("en-IN")
											: "—",
									],
									[
										"Expected Handover",
										project.expected_end_date
											? new Date(
													project.expected_end_date,
												).toLocaleDateString("en-IN")
											: "—",
									],
									[
										"Created",
										new Date(
											project.created_at,
										).toLocaleDateString("en-IN"),
									],
									[
										"Last Updated",
										new Date(
											project.updated_at,
										).toLocaleDateString("en-IN"),
									],
								] as [string, string][]
							).map(([label, val]) => (
								<div
									key={label}
									style={{
										padding: "10px 0",
										borderBottom: "1px solid var(--border)",
									}}
								>
									<div
										style={{
											fontSize: ".62rem",
											letterSpacing: ".1em",
											textTransform: "uppercase",
											color: "var(--gray)",
											marginBottom: 4,
										}}
									>
										{label}
									</div>
									<div
										style={{
											fontSize: ".82rem",
											color: "var(--lgray)",
										}}
									>
										{val}
									</div>
								</div>
							))}
						</div>
						{project.description && (
							<div style={{ marginTop: 16 }}>
								<div
									style={{
										fontSize: ".62rem",
										letterSpacing: ".1em",
										textTransform: "uppercase",
										color: "var(--gray)",
										marginBottom: 6,
									}}
								>
									Description
								</div>
								<div
									style={{
										fontSize: ".82rem",
										color: "var(--lgray)",
										lineHeight: 1.6,
									}}
								>
									{project.description}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* ── POST UPDATE MODAL ── */}
			<div
				className={cn(
					"fixed inset-0 z-[1000] grid place-items-center bg-black/65 p-4 backdrop-blur-sm transition",
					showUpd ? "visible opacity-100" : "invisible opacity-0",
				)}
				onClick={(e) =>
					e.target === e.currentTarget && setShowUpd(false)
				}
			>
				<div
					className="w-full max-w-[500px] rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] shadow-2xl"
					style={{ maxWidth: 500 }}
				>
					<div className="h-1 w-full bg-[#fbbf24]" />
					<div className="p-5">
						<div className="mb-4 flex items-center justify-between">
							<div className="text-2xl text-[#1f2a34]">
								Post Update
							</div>
							<button
								className="rounded border border-black/10 px-2 py-1 text-sm text-[#5d6a78] transition hover:border-[#fbbf24] hover:text-[#f59e0b]"
								onClick={() => setShowUpd(false)}
							>
								✕
							</button>
						</div>

						<div className="mb-4 space-y-1">
							<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
								Work Category
							</label>
							<select
								className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
								value={updForm.category}
								onChange={(e) =>
									setUpdForm((f) => ({
										...f,
										category: e.target
											.value as WorkCategory,
									}))
								}
							>
								{CATS.map((c) => (
									<option key={c.v} value={c.v}>
										{c.l}
									</option>
								))}
							</select>
						</div>
						<div className="mb-4 space-y-1">
							<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
								Update Title *
							</label>
							<input
								className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
								placeholder="e.g. Foundation slab complete"
								value={updForm.title}
								onChange={(e) =>
									setUpdForm((f) => ({
										...f,
										title: e.target.value,
									}))
								}
							/>
						</div>
						<div className="mb-4 space-y-1">
							<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
								Description
							</label>
							<textarea
								className="min-h-24 w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
								placeholder="What was done? Materials used? Next steps?"
								value={updForm.description ?? ""}
								onChange={(e) =>
									setUpdForm((f) => ({
										...f,
										description: e.target.value,
									}))
								}
							/>
						</div>
						<div className="mb-4 space-y-1">
							<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
								Category Progress —{" "}
								{updForm.progress_percentage}%
							</label>
							<input
								type="range"
								min={0}
								max={100}
								step={5}
								value={updForm.progress_percentage}
								onChange={(e) =>
									setUpdForm((f) => ({
										...f,
										progress_percentage: parseInt(
											e.target.value,
										),
									}))
								}
							/>
						</div>
						<div className="mb-4 space-y-1">
							<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
								Photo URLs (optional)
							</label>
							<div
								style={{
									display: "flex",
									gap: 8,
									marginBottom: 8,
								}}
							>
								<input
									type="file"
									accept="image/*"
									onChange={handlePhotoUpload}
									disabled={uploadingPhoto}
									style={{
										flex: 1,
										cursor: uploadingPhoto
											? "not-allowed"
											: "pointer",
									}}
								/>
								<button
									className="rounded bg-[#fbbf24] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-black transition hover:bg-[#fbbf24]-light disabled:opacity-60"
									disabled={uploadingPhoto}
									style={{
										opacity: uploadingPhoto ? 0.6 : 1,
									}}
								>
									{uploadingPhoto ? "Uploading…" : "Upload"}
								</button>
							</div>
							<div style={{ display: "flex", gap: 8 }}>
								<input
									className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
									style={{ flex: 1 }}
									placeholder="Or paste image URL…"
									value={photoIn}
									onChange={(e) => setPhotoIn(e.target.value)}
								/>
								<button
									className="rounded border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#5d6a78] transition hover:border-[#fbbf24] hover:text-[#f59e0b]"
									onClick={addPhoto}
								>
									Add
								</button>
							</div>
							{updForm.photo_urls.map((url, i) => (
								<div
									key={i}
									style={{
										display: "flex",
										alignItems: "center",
										gap: 8,
										marginTop: 5,
										fontSize: ".72rem",
										color: "var(--lgray)",
									}}
								>
									<span
										style={{
											flex: 1,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										📸 {url}
									</span>
									<button
										className="rounded border border-black/10 px-2 py-1 text-sm text-[#5d6a78] transition hover:border-[#fbbf24] hover:text-[#f59e0b]"
										onClick={() =>
											setUpdForm((f) => ({
												...f,
												photo_urls: f.photo_urls.filter(
													(_, j) => j !== i,
												),
											}))
										}
									>
										✕
									</button>
								</div>
							))}
						</div>
						<div className="mt-3 flex gap-2">
							<button
								className="rounded border border-black/10 px-4 py-2 text-sm text-[#5d6a78] transition hover:border-[#fbbf24] hover:text-[#f59e0b]"
								onClick={() => setShowUpd(false)}
							>
								Cancel
							</button>
							<button
								className="flex-1 rounded bg-[#fbbf24] px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-brand-black transition hover:bg-[#fbbf24]-light disabled:opacity-60"
								style={{ flex: 1 }}
								onClick={postUpdate}
								disabled={saving}
							>
								{saving ? "Posting…" : "Post Update →"}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* ── ADD MATERIAL MODAL ── */}
			<div
				className={cn(
					"fixed inset-0 z-[1000] grid place-items-center bg-black/65 p-4 backdrop-blur-sm transition",
					showMat ? "visible opacity-100" : "invisible opacity-0",
				)}
				onClick={(e) =>
					e.target === e.currentTarget && setShowMat(false)
				}
			>
				<div
					className="w-full max-w-[460px] rounded-md border border-black/10 bg-[rgba(224,234,242,0.3)] shadow-2xl"
					style={{ maxWidth: 460 }}
				>
					<div className="h-1 w-full bg-[#fbbf24]" />
					<div className="p-5">
						<div className="mb-4 flex items-center justify-between">
							<div className="text-2xl text-[#1f2a34]">
								Log Material
							</div>
							<button
								className="rounded border border-black/10 px-2 py-1 text-sm text-[#5d6a78] transition hover:border-[#fbbf24] hover:text-[#f59e0b]"
								onClick={() => setShowMat(false)}
							>
								✕
							</button>
						</div>
						<div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
							<div className="space-y-1">
								<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
									Material Type
								</label>
								<select
									className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
									value={matForm.material_type}
									onChange={(e) =>
										setMatForm((f) => ({
											...f,
											material_type: e.target
												.value as MaterialType,
										}))
									}
								>
									{MAT_TYPES.map((t) => (
										<option key={t} value={t}>
											{t.replace("_", " ")}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-1">
								<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
									Name *
								</label>
								<input
									className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
									placeholder="e.g. Red Clay Bricks"
									value={matForm.name}
									onChange={(e) =>
										setMatForm((f) => ({
											...f,
											name: e.target.value,
										}))
									}
								/>
							</div>
						</div>
						<div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
							<div className="space-y-1">
								<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
									Quantity *
								</label>
								<input
									className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
									type="number"
									min="0"
									placeholder="500"
									value={matForm.quantity}
									onChange={(e) =>
										setMatForm((f) => ({
											...f,
											quantity: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-1">
								<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
									Unit
								</label>
								<input
									className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
									placeholder="bags / kg / pieces"
									value={matForm.unit}
									onChange={(e) =>
										setMatForm((f) => ({
											...f,
											unit: e.target.value,
										}))
									}
								/>
							</div>
						</div>
						<div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
							<div className="space-y-1">
								<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
									Unit Cost ₹ *
								</label>
								<input
									className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
									type="number"
									min="0"
									placeholder="12.50"
									value={matForm.unit_cost}
									onChange={(e) =>
										setMatForm((f) => ({
											...f,
											unit_cost: e.target.value,
										}))
									}
								/>
							</div>
							<div className="space-y-1">
								<label className="text-xs uppercase tracking-[0.08em] text-[#888888]">
									Supplier
								</label>
								<input
									className="w-full border-b-2 border-black/10 bg-black/5 px-3 py-2 text-sm text-[#1f2a34] outline-none transition focus:border-[#fbbf24]"
									placeholder="Supplier name"
									value={matForm.supplier ?? ""}
									onChange={(e) =>
										setMatForm((f) => ({
											...f,
											supplier: e.target.value,
										}))
									}
								/>
							</div>
						</div>
						{matForm.quantity && matForm.unit_cost && (
							<div
								style={{
									padding: "8px 12px",
									background: "var(--panel2)",
									marginBottom: 12,
									borderLeft: "3px solid var(--gold)",
									fontSize: ".78rem",
								}}
							>
								Total:{" "}
								<span
									style={{
										color: "var(--gold)",
										fontFamily:
											"'Cormorant Garamond',serif",
										fontSize: "1.05rem",
									}}
								>
									₹
									{(
										parseFloat(matForm.quantity || "0") *
										parseFloat(matForm.unit_cost || "0")
									).toLocaleString()}
								</span>
							</div>
						)}
						<div className="mt-3 flex gap-2">
							<button
								className="rounded border border-black/10 px-4 py-2 text-sm text-[#5d6a78] transition hover:border-[#fbbf24] hover:text-[#f59e0b]"
								onClick={() => setShowMat(false)}
							>
								Cancel
							</button>
							<button
								className="flex-1 rounded bg-[#fbbf24] px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-brand-black transition hover:bg-[#fbbf24]-light disabled:opacity-60"
								style={{ flex: 1 }}
								onClick={addMaterial}
								disabled={saving}
							>
								{saving ? "Saving…" : "Log Material →"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
