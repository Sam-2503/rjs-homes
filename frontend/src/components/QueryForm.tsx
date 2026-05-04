import { useState } from "react";
import { Input, Button, Card } from ".";
import type { CreateQueryRequest } from "../types";

interface QueryFormProps {
	projectId: string;
	onSubmit: (query: CreateQueryRequest) => Promise<void>;
	loading?: boolean;
}

export default function QueryForm({
	projectId,
	onSubmit,
	loading = false,
}: QueryFormProps) {
	const [question, setQuestion] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!question.trim()) {
			setError("Question is required");
			return;
		}

		setSubmitting(true);
		try {
			await onSubmit({
				question: question.trim(),
				project_id: projectId,
			});
			setQuestion("");
		} catch (err: any) {
			setError(
				err?.response?.data?.detail ||
					err?.message ||
					"Failed to submit question",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Card className="mb-6 border-black/10 bg-[rgba(224,234,242,0.3)]">
			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<h3 className="text-xl font-semibold text-[#1f2a34]">
					Ask a Question
				</h3>

				<Input
					label="Your Question"
					placeholder="e.g., When will plumbing start? What's the timeline for completion?"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					error={error && !question.trim() ? error : ""}
					disabled={submitting || loading}
					fullWidth
				/>

				{error && (
					<div className="rounded-md border border-black/10 bg-black/5 px-4 py-3 text-sm text-[#b45309]">
						{error}
					</div>
				)}

				<div className="flex gap-3 max-md:flex-col">
					<Button
						type="submit"
						variant="primary"
						disabled={submitting || loading}
						isLoading={submitting || loading}
						className="w-full max-w-[200px] max-md:max-w-none"
					>
						Submit Question
					</Button>
				</div>
			</form>
		</Card>
	);
}
