import React, { useState, useEffect } from "react";
import { cn } from "../utils/cn";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg";
	closeOnBackdrop?: boolean;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = "md",
	closeOnBackdrop = true,
}: ModalProps) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShow(true);
			document.body.style.overflow = "hidden";
		} else {
			setShow(false);
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	if (!show) return null;

	const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
		sm: "max-w-[400px]",
		md: "max-w-[600px]",
		lg: "max-w-[800px]",
	};

	const handleBackdropClick = () => {
		if (closeOnBackdrop) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-[2px] animate-fade-in"
			onClick={handleBackdropClick}
		>
			<div
				className={cn(
					"flex max-h-[90vh] w-[90%] flex-col overflow-hidden rounded-lg border border-brand-border bg-brand-card shadow-[0_20px_60px_rgba(0,0,0,0.5)] outline-none animate-fade-up max-md:w-[95%] max-md:max-w-none",
					sizeClass[size],
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex shrink-0 items-center justify-between gap-4 border-b border-brand-border bg-[rgba(200,151,31,0.03)] px-5 py-5 sm:px-6">
					{title && (
						<h2 className="text-2xl font-semibold text-white">
							{title}
						</h2>
					)}
					<button
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-2xl leading-none text-brand-muted transition hover:bg-[rgba(200,151,31,0.1)] hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
						onClick={onClose}
						aria-label="Close modal"
					>
						×
					</button>
				</div>
				<div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
					{children}
				</div>
				{footer && (
					<div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-brand-border bg-[rgba(255,255,255,0.02)] px-5 py-5 max-sm:flex-col max-sm:items-stretch sm:px-6">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
