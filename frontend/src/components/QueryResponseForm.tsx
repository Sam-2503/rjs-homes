import { useState } from "react";
import { Button } from ".";
import type { Query, RespondToQueryRequest } from "../types";
import api from "../api/client";

interface QueryResponseFormProps {
	query: Query;
	onSubmit: (response: RespondToQueryRequest) => Promise<void>;
	loading?: boolean;
}

export default function QueryResponseForm({
	query,
	onSubmit,
	loading = false,
}: QueryResponseFormProps) {
	const [answer, setAnswer] = useState("");
	const [mediaUrls, setMediaUrls] = useState<string[]>([]);
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [uploading, setUploading] = useState(false);

	const handleMediaUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploading(true);
		setError("");
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

			setMediaUrls((prev) => [...prev, ...uploadedUrls]);
		} catch (err: any) {
			setError(
				err?.response?.data?.detail ||
					err?.message ||
					"Failed to upload image",
			);
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	};

	const removeMedia = (url: string) => {
		setMediaUrls((prev) => prev.filter((item) => item !== url));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!answer.trim()) {
			setError("Response is required");
			return;
		}

		setSubmitting(true);
		try {
			await onSubmit({
				answer: answer.trim(),
				answer_media_urls: mediaUrls,
			});
			setAnswer("");
			setMediaUrls([]);
		} catch (err: any) {
			setError(
				err?.response?.data?.detail ||
					err?.message ||
					"Failed to submit response",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="rounded-lg border border-brand-gold border-l-4 border-l-brand-gold bg-brand-card">
			<div className="mb-5 border-b border-brand-border pb-5">
				<h3 className="mb-3 text-lg font-semibold text-white">
					Respond to Question
				</h3>
				<div className="text-base text-brand-muted-light">
					<strong>{query.question}</strong>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-3">
					<label
						htmlFor="response-text"
						className="text-base font-medium text-brand-muted-light"
					>
						Your Response
					</label>
					<textarea
						id="response-text"
						className="min-h-[100px] resize-y rounded-md border border-brand-border bg-brand-panel px-4 py-3 text-base leading-6 text-white outline-none transition placeholder:text-[#3a3a3a] focus:border-brand-gold focus:bg-brand-panel-light focus:ring-2 focus:ring-brand-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
						placeholder="Provide your detailed response..."
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						disabled={submitting || loading}
						rows={4}
					/>
				</div>

				<div className="flex flex-col gap-3">
					<label
						htmlFor="response-media"
						className="text-base font-medium text-brand-muted-light"
					>
						Attach Images (optional)
					</label>
					<input
						id="response-media"
						type="file"
						accept="image/*"
						multiple
						onChange={handleMediaUpload}
						disabled={submitting || loading || uploading}
						className="rounded-md border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-muted-light file:mr-3 file:rounded file:border-0 file:bg-brand-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black"
					/>
					{uploading && (
						<div className="text-sm text-brand-muted-light">
							Uploading image...
						</div>
					)}
					{mediaUrls.length > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{mediaUrls.map((url) => (
								<div
									key={url}
									className="relative overflow-hidden rounded-md border border-brand-border"
								>
									<img
										src={url}
										alt="Response media"
										className="h-24 w-full object-cover"
									/>
									<button
										type="button"
										onClick={() => removeMedia(url)}
										className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white"
									>
										Remove
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{error && (
					<div className="rounded-md border border-red-700 bg-[rgba(192,57,43,0.1)] px-4 py-3 text-sm text-red-400">
						{error}
					</div>
				)}

				<div className="flex gap-3 border-t border-brand-border pt-4 max-md:flex-col">
					<Button
						type="submit"
						variant="primary"
						disabled={submitting || loading || uploading}
						isLoading={submitting || loading}
						className="w-full max-w-[200px] max-md:max-w-none"
					>
						Send Response
					</Button>
				</div>
			</form>
		</div>
	);
}
