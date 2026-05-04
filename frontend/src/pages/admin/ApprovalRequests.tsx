import { useState, useEffect } from "react";
import { Badge, Button, Modal, Input, useToast } from "../../components";
import api from "../../api/client";
import type { BuilderRequest } from "../../types";
import { cn } from "../../utils";

type ApprovalAction = "approve" | "reject" | null;

interface ApprovalState {
	requestId: string;
	action: ApprovalAction;
	notesOpen: boolean;
	notes: string;
}

export default function ApprovalRequests() {
	const [requests, setRequests] = useState<BuilderRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [approvalState, setApprovalState] = useState<ApprovalState>({
		requestId: "",
		action: null,
		notesOpen: false,
		notes: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const toast = useToast();

	const loadRequests = async () => {
		setLoading(true);
		try {
			const res = await api.get<BuilderRequest[]>("/api/admin/requests");
			setRequests(res.data);
		} catch (err: any) {
			toast(err?.response?.data?.detail || "Failed to load requests");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadRequests();
	}, []);

	const openApprovalModal = (requestId: string, action: ApprovalAction) => {
		setApprovalState({
			requestId,
			action,
			notesOpen: true,
			notes: "",
		});
	};

	const closeModal = () => {
		setApprovalState({
			requestId: "",
			action: null,
			notesOpen: false,
			notes: "",
		});
	};

	const handleApproval = async () => {
		const { requestId, action, notes } = approvalState;

		if (action === "reject" && !notes.trim()) {
			toast("Rejection reason is required");
			return;
		}

		setSubmitting(true);
		try {
			if (action === "approve") {
				await api.post(`/api/admin/requests/${requestId}/approve`, {
					notes: notes.trim() || null,
				});
				toast("Builder approved successfully!");
			} else if (action === "reject") {
				await api.post(`/api/admin/requests/${requestId}/reject`, {
					reason: notes.trim(),
				});
				toast("Builder request rejected");
			}

			closeModal();
			// Reload requests after brief delay to ensure DB is updated
			setTimeout(() => {
				loadRequests();
			}, 300);
		} catch (err: any) {
			console.error("Approval error:", err);
			toast(err?.response?.data?.detail || "Failed to process request");
		} finally {
			setSubmitting(false);
		}
	};

	const pendingCount = requests.filter((r) => r.status === "pending").length;
	const approvedCount = requests.filter(
		(r) => r.status === "approved",
	).length;
	const rejectedCount = requests.filter(
		(r) => r.status === "rejected",
	).length;

	return (
		<div className="flex flex-col gap-6 p-6 max-md:p-4">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-[1.75rem] font-semibold text-[#1f2a34] max-md:text-2xl">
						Builder Approval Requests
					</h1>
					<p className="text-sm text-[#5d6a78]">
						Review and approve pending builder registrations
					</p>
				</div>

				<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] max-md:grid-cols-1">
					<div className="flex flex-col gap-3 rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] p-4 text-center">
						<div className="text-2xl font-bold text-[#1f2a34]">
							{pendingCount}
						</div>
						<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
							Pending
						</div>
					</div>
					<div className="flex flex-col gap-3 rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] p-4 text-center">
						<div className="text-2xl font-bold text-[#1f2a34]">
							{approvedCount}
						</div>
						<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
							Approved
						</div>
					</div>
					<div className="flex flex-col gap-3 rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)] p-4 text-center">
						<div className="text-2xl font-bold text-[#1f2a34]">
							{rejectedCount}
						</div>
						<div className="text-xs font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
							Rejected
						</div>
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-lg border border-black/10 bg-[rgba(224,234,242,0.3)]">
				{loading ? (
					<div className="flex min-h-[280px] items-center justify-center p-8 text-sm text-[#5d6a78]">
						Loading requests...
					</div>
				) : requests.length === 0 ? (
					<div className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-8 text-center">
						<div className="text-4xl text-[#1f2a34]">✓</div>
						<div className="text-lg font-semibold text-[#1f2a34]">
							All caught up!
						</div>
						<div className="text-sm text-[#5d6a78]">
							No builder requests to process
						</div>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full border-collapse">
							<thead>
								<tr className="border-b-2 border-black/10 bg-black/5">
									<th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78] max-md:hidden">
										Email
									</th>
									<th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
										Full Name
									</th>
									<th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
										Status
									</th>
									<th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78] max-md:hidden">
										Submitted
									</th>
									<th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.05em] text-[#5d6a78]">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-border">
								{requests.map((request) => (
									<tr
										key={request.id}
										className={cn(
											"transition-colors duration-300 hover:bg-black/5",
											request.status === "pending" &&
												"bg-[rgba(199,206,214,0.08)]",
											request.status === "approved" &&
												"bg-[rgba(199,206,214,0.08)]",
											request.status === "rejected" &&
												"bg-[rgba(199,206,214,0.08)]",
										)}
									>
										<td className="px-4 py-4 font-mono text-sm text-[#475462] max-md:hidden">
											{request.email}
										</td>
										<td className="px-4 py-4 text-sm font-medium text-[#1f2a34]">
											{request.full_name}
										</td>
										<td className="px-4 py-4 text-sm text-[#1f2a34]">
											<Badge
												status={
													request.status === "pending"
														? "pending"
														: request.status ===
															  "approved"
															? "done"
															: "blocked"
												}
											>
												{request.status}
											</Badge>
										</td>
										<td className="px-4 py-4 text-sm text-[#5d6a78] max-md:hidden">
											{new Date(
												request.created_at,
											).toLocaleDateString()}
										</td>
										<td className="px-4 py-4 text-right text-sm text-[#1f2a34]">
											{request.status === "pending" ? (
												<div className="flex flex-col justify-end gap-2 lg:flex-row">
													<Button
														variant="primary"
														size="sm"
														className="w-full lg:w-auto"
														onClick={() =>
															openApprovalModal(
																request.id,
																"approve",
															)
														}
														disabled={submitting}
													>
														Approve
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="w-full lg:w-auto"
														onClick={() =>
															openApprovalModal(
																request.id,
																"reject",
															)
														}
														disabled={submitting}
													>
														Reject
													</Button>
												</div>
											) : (
												<span className="text-[#5d6a78]">
													—
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<Modal
				isOpen={approvalState.notesOpen}
				onClose={closeModal}
				title={
					approvalState.action === "approve"
						? "Approve Builder Request"
						: "Reject Builder Request"
				}
				size="md"
				footer={
					<div className="flex w-full flex-col justify-end gap-3 sm:flex-row">
						<Button
							variant="outline"
							onClick={closeModal}
							disabled={submitting}
							className="min-w-[120px] sm:w-auto"
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={handleApproval}
							disabled={submitting}
							isLoading={submitting}
							className="min-w-[120px] sm:w-auto"
						>
							{approvalState.action === "approve"
								? "Approve"
								: "Reject"}
						</Button>
					</div>
				}
			>
				<div className="flex flex-col gap-4">
					{approvalState.action === "approve" ? (
						<>
							<p className="text-sm leading-6 text-[#5d6a78]">
								Are you sure you want to approve this builder
								request?
							</p>
							<Input
								label="Approval Notes (optional)"
								placeholder="Add any notes for the builder..."
								value={approvalState.notes}
								onChange={(e) =>
									setApprovalState((prev) => ({
										...prev,
										notes: e.target.value,
									}))
								}
								fullWidth
								disabled={submitting}
							/>
						</>
					) : (
						<>
							<p className="text-sm leading-6 text-[#5d6a78]">
								Please provide a reason for rejecting this
								request:
							</p>
							<textarea
								className="min-h-[120px] w-full resize-y rounded-md border border-black/10 bg-black/5 px-4 py-3 text-sm text-[#1f2a34] outline-none transition placeholder:text-[#3a3a3a] hover:border-black/10 hover:bg-black/5 focus:border-black/20 focus:bg-black/5 focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:bg-black/5-light disabled:opacity-50"
								placeholder="Rejection reason..."
								value={approvalState.notes}
								onChange={(e) =>
									setApprovalState((prev) => ({
										...prev,
										notes: e.target.value,
									}))
								}
								disabled={submitting}
								rows={3}
							/>
							{!approvalState.notes.trim() && (
								<div className="rounded-md border border-black/10 bg-black/5 px-4 py-3 text-sm text-[#5d6a78]">
									Rejection reason is required
								</div>
							)}
						</>
					)}
				</div>
			</Modal>
		</div>
	);
}
