export default function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-gray-50 px-4 py-12 md:px-8">
			<div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 md:grid-cols-4">
				<div>
					<div className="flex items-center gap-3">
						<img
							src="/rjs-logo.svg"
							alt="RJS Homes logo"
							className="h-10 w-10 rounded-full border border-[#d5b47a]/50 bg-[radial-gradient(circle_at_30%_25%,#e4cda2_0%,#b68945_60%,#7a5a2e_100%)]"
						/>
						<div className="text-xl font-bold text-gray-900">
							RJS Homes
						</div>
					</div>
					<p className="mt-3 max-w-[300px] text-sm leading-7 text-gray-600">
						We take care of planning and construction of your dream
						house till delivering your furniture right at your
						doorstep.
					</p>
				</div>

				<div>
					<div className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-900">
						Quick Links
					</div>
					<ul className="mt-4 space-y-2 text-sm text-gray-600">
						<li>
							<a
								href="#about"
								className="transition hover:text-gray-900"
							>
								About
							</a>
						</li>
						<li>
							<a
								href="#services"
								className="transition hover:text-gray-900"
							>
								Services
							</a>
						</li>
						<li>
							<a
								href="#process"
								className="transition hover:text-gray-900"
							>
								Our Process
							</a>
						</li>
						<li>
							<a
								href="#contact"
								className="transition hover:text-gray-900"
							>
								Contact
							</a>
						</li>
					</ul>
				</div>

				<div>
					<div className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-900">
						Services
					</div>
					<ul className="mt-4 space-y-2 text-sm text-gray-600">
						<li>
							<a
								href="/login"
								className="transition hover:text-gray-900"
							>
								Construction Services
							</a>
						</li>
						<li>
							<a
								href="/shop"
								className="transition hover:text-gray-900"
							>
								Shop for Furniture
							</a>
						</li>
					</ul>
				</div>

				<div>
					<div className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-900">
						Contact
					</div>
					<div className="mt-4 space-y-3 text-sm text-gray-600">
						<div>
							<a
								href="tel:+919599998888"
								className="transition hover:text-gray-900"
							>
								+91 95 9999 8888
							</a>
						</div>
						<div>
							<a
								href="mailto:hello@rjshomes.com"
								className="transition hover:text-gray-900"
							>
								hello@rjshomes.com
							</a>
						</div>
						<div>Hyderabad, Telangana</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
