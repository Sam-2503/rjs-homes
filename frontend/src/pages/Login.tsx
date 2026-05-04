import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

interface RoleOption {
	id: UserRole;
	name: string;
}

const ROLES: RoleOption[] = [
	{ id: "builder", name: "Builder" },
	{ id: "client", name: "Client" },
];

function EyeIcon({ open }: { open: boolean }) {
	return open ? (
		<svg
			viewBox="0 0 24 24"
			className="h-4.5 w-4.5"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
				stroke="currentColor"
				strokeWidth="1.7"
			/>
			<circle
				cx="12"
				cy="12"
				r="3"
				stroke="currentColor"
				strokeWidth="1.7"
			/>
		</svg>
	) : (
		<svg
			viewBox="0 0 24 24"
			className="h-4.5 w-4.5"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M4 4l16 16"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
			<path
				d="M10.5 10.6a3 3 0 0 0 4.2 4.2"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
			<path
				d="M9.3 5.4A10.5 10.5 0 0 1 12 5.1c6 0 9.5 6.9 9.5 6.9a18.8 18.8 0 0 1-3.6 4.8"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
			<path
				d="M14.7 18.6A10.8 10.8 0 0 1 12 18.9c-6 0-9.5-6.9-9.5-6.9a18.6 18.6 0 0 1 3.2-4.4"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export default function Login() {
	const { login, register, loading } = useAuth();
	const navigate = useNavigate();

	const [mode, setMode] = useState<"login" | "register">("login");
	const [role, setRole] = useState<UserRole>("client");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [err, setErr] = useState("");
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const switchMode = (nextMode: "login" | "register") => {
		setMode(nextMode);
		setErr("");
		setShowSuccessMessage(false);
		setShowPassword(false);
	};

	const submit = async () => {
		setErr("");

		if (!email || !password) {
			setErr("Please fill all required fields.");
			return;
		}

		if (mode === "register" && !fullName) {
			setErr("Name is required.");
			return;
		}

		try {
			const result =
				mode === "login"
					? await login(email, password)
					: await register({
							full_name: fullName,
							email,
							password,
							role,
						});

			if (mode === "register" && role === "builder") {
				setShowSuccessMessage(true);
				setEmail("");
				setPassword("");
				setFullName("");
				return;
			}

			navigate(result.role === "client" ? "/client" : "/builder");
		} catch (error: any) {
			console.error("Submit error:", error);
			let errorMessage = "Something went wrong";

			// Handle validation errors (array format from FastAPI)
			if (Array.isArray(error?.response?.data?.detail)) {
				errorMessage = error.response.data.detail
					.map((e: any) => e.msg || e.message || "Unknown error")
					.join(", ");
			}
			// Handle string detail message
			else if (typeof error?.response?.data?.detail === "string") {
				errorMessage = error.response.data.detail;
			}
			// Handle custom error message
			else if (error?.message) {
				errorMessage = error.message;
			}

			setErr(errorMessage || "Something went wrong");
		}
	};

	return (
		<>
			{mode === "register" ? (
				<title>RJS Homes - Register</title>
			) : (
				<title>RJS Homes - Login</title>
			)}
			<div className="relative min-h-screen overflow-hidden bg-[#eef3f6] px-4 py-8 text-[#1b242d] md:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_68%),radial-gradient(60%_45%_at_15%_20%,rgba(255,255,255,0.55)_0%,transparent_60%)]" />

				<div className="relative mx-auto flex min-h-screen w-full max-w-[1180px] items-center justify-center">
					<div className="grid w-full gap-8 rounded-[18px] border border-black/10 bg-[#dbe6ec]/95 p-4 shadow-[0_24px_60px_rgba(24,39,51,0.12)] md:grid-cols-[0.95fr_1.05fr] md:p-5 lg:p-6">
						<div className="flex min-h-[220px] flex-col justify-between rounded-[14px] bg-[linear-gradient(180deg,#dbe6ec_0%,#cfdce4_100%)] p-6 md:min-h-full md:p-8">
							<div>
								<button
									type="button"
									className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1e2a35] transition hover:border-black/20 hover:bg-white"
									onClick={() => navigate("/")}
								>
									<span aria-hidden="true">←</span>
									Back Home
								</button>

								<div className="mt-10 flex items-center gap-3">
									<img
										src="/rjs-logo.svg"
										alt="RJS Homes logo"
										className="h-12 w-12 rounded-full border border-[#d5b47a]/50 bg-[radial-gradient(circle_at_30%_25%,#e4cda2_0%,#b68945_60%,#7a5a2e_100%)]"
									/>
									<div>
										<div className="font-serif text-xl font-semibold text-[#1f2a34]">
											RJS Homes
										</div>
										<div className="text-[10px] uppercase tracking-[0.18em] text-[#5d6a78]">
											Construction
										</div>
									</div>
								</div>

								<h1 className="mt-8 max-w-[420px] text-[clamp(2.2rem,3vw,3.5rem)] font-semibold leading-[1.08] text-[#1e2a35]">
									Access your project workspace.
								</h1>
								<p className="mt-4 max-w-[440px] text-[15px] leading-7 text-[#51606e]">
									Sign in to review updates, approvals, and
									project progress. New clients and builders
									can register from the same screen.
								</p>
							</div>
						</div>

						<div className="rounded-[14px] border border-black/10 bg-[#f7f8fa] p-5 md:p-7 lg:p-8">
							{showSuccessMessage ? (
								<div className="space-y-6">
									<div>
										<div className="text-[11px] uppercase tracking-[0.16em] text-[#5f6c79]">
											Registration status
										</div>
										<h2 className="mt-3 text-[clamp(2rem,2.8vw,2.6rem)] font-semibold text-[#1f2a34]">
											Registration submitted.
										</h2>
										<p className="mt-3 text-sm leading-7 text-[#556271]">
											Your builder account has been
											created and is pending admin
											approval.
										</p>
									</div>

									<div className="rounded-[12px] border border-[#cfe1cf] bg-[#eef6ee] p-5 text-[#28553a]">
										<div className="text-[11px] font-semibold uppercase tracking-[0.14em]">
											Pending admin approval
										</div>
										<p className="mt-2 text-sm leading-6 text-[#44644f]">
											We review every builder account for
											quality and security before access
											is granted.
										</p>
									</div>

									<button
										type="button"
										className="w-full rounded-full bg-[#1e2a35] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-95"
										onClick={() => {
											setShowSuccessMessage(false);
											switchMode("login");
										}}
									>
										Back to sign in
									</button>
								</div>
							) : (
								<div className="space-y-6">
									<div>
										<div className="text-[11px] uppercase tracking-[0.16em] text-[#5f6c79]">
											{mode === "login"
												? "Sign in"
												: "Register"}
										</div>
										<h2 className="mt-3 text-[clamp(2rem,2.8vw,2.8rem)] font-semibold text-[#1f2a34]">
											{mode === "login"
												? "Welcome back."
												: "Create account."}
										</h2>
										<p className="mt-3 text-sm leading-7 text-[#556271]">
											{mode === "login"
												? "Sign in to access your project dashboard."
												: "Register as a builder or client using the same RJS Homes theme."}
										</p>
									</div>

									<div className="flex rounded-full border border-black/10 bg-white/75 p-1">
										<button
											type="button"
											className={`flex-1 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
												mode === "register"
													? "bg-[#1e2a35] text-white"
													: "text-[#4f5d6a] hover:bg-black/5"
											}`}
											onClick={() =>
												switchMode("register")
											}
										>
											Register
										</button>
										<button
											type="button"
											className={`flex-1 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
												mode === "login"
													? "bg-[#1e2a35] text-white"
													: "text-[#4f5d6a] hover:bg-black/5"
											}`}
											onClick={() => switchMode("login")}
										>
											Sign in
										</button>
									</div>

									{mode === "register" && (
										<div className="space-y-3">
											<label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5f6c79]">
												I am a:
											</label>
											<div className="grid grid-cols-2 gap-3">
												{ROLES.map((item) => {
													const selected =
														role === item.id;
													return (
														<button
															key={item.id}
															type="button"
															className={`relative rounded-[12px] border p-4 text-center transition duration-300 ${
																selected
																	? "border-[#1e2a35] bg-[#dbe6ec]"
																	: "border-black/10 bg-white/75 hover:border-black/20 hover:bg-white"
															}`}
															onClick={() =>
																setRole(item.id)
															}
														>
															{selected && (
																<div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1e2a35] text-[9px] font-bold text-white">
																	✓
																</div>
															)}
															<div className="text-[12px] font-semibold text-[#1f2a34]">
																{item.name}
															</div>
														</button>
													);
												})}
											</div>
										</div>
									)}

									<div className="space-y-4">
										{mode === "register" && (
											<div>
												<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5f6c79]">
													Full name
												</label>
												<input
													className="w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1b242d] outline-none transition placeholder:text-[#8b99a6] focus:border-[#1e2a35]/50"
													placeholder="Your full name"
													value={fullName}
													onChange={(e) =>
														setFullName(
															e.target.value,
														)
													}
												/>
											</div>
										)}

										<div>
											<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5f6c79]">
												Email address
											</label>
											<input
												className="w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1b242d] outline-none transition placeholder:text-[#8b99a6] focus:border-[#1e2a35]/50"
												type="email"
												placeholder="you@example.com"
												value={email}
												onChange={(e) =>
													setEmail(e.target.value)
												}
												onKeyDown={(e) =>
													e.key === "Enter" &&
													submit()
												}
											/>
										</div>

										<div>
											<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5f6c79]">
												Password
											</label>
											<div className="relative">
												<input
													className="w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 pr-12 text-sm text-[#1b242d] outline-none transition placeholder:text-[#8b99a6] focus:border-[#1e2a35]/50"
													type={
														showPassword
															? "text"
															: "password"
													}
													placeholder="••••••••"
													value={password}
													onChange={(e) =>
														setPassword(
															e.target.value,
														)
													}
													onKeyDown={(e) =>
														e.key === "Enter" &&
														submit()
													}
												/>
												<button
													type="button"
													className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#607181] transition hover:bg-black/5 hover:text-[#1e2a35]"
													onClick={() =>
														setShowPassword(
															(prev) => !prev,
														)
													}
													aria-label={
														showPassword
															? "Hide password"
															: "Show password"
													}
												>
													<EyeIcon
														open={showPassword}
													/>
												</button>
											</div>
										</div>
									</div>

									{err && (
										<div className="rounded-[12px] border border-[#e2b1ab] bg-[#f8ece9] px-4 py-3 text-sm text-[#8c3d35]">
											{err}
										</div>
									)}

									<button
										type="button"
										className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1e2a35] px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
										onClick={submit}
										disabled={loading}
									>
										{loading
											? "Please wait..."
											: mode === "login"
												? "Sign in"
												: "Create account"}
									</button>

									<div className="text-center text-[11px] text-[#5f6c79]">
										{mode === "login" ? (
											<>
												No account yet?{" "}
												<button
													type="button"
													className="font-semibold text-[#1e2a35] transition hover:opacity-80"
													onClick={() =>
														switchMode("register")
													}
												>
													Register here
												</button>
											</>
										) : (
											<>
												Already have an account?{" "}
												<button
													type="button"
													className="font-semibold text-[#1e2a35] transition hover:opacity-80"
													onClick={() =>
														switchMode("login")
													}
												>
													Sign in
												</button>
											</>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
