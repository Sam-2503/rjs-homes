import { useNavigate } from "react-router-dom";

export default function Services() {
	const navigate = useNavigate();

	const sectionHeaderClass =
		"mx-auto mb-16 max-w-[700px] text-center [&>h2]:mb-4 [&>h2]:[&>h2]:text-5xl [&>h2]:font-bold [&>h2]:text-white [&>p]:text-[1.05rem] [&>p]:leading-[1.6] [&>p]:text-[#999]";
	const primaryButtonClass =
		"border-0 bg-[#8b3a2a] px-7 py-3 text-[0.8rem] font-medium uppercase tracking-[0.08em] text-[#fdfaf5] transition hover:bg-[#b35942]";
	const outlineButtonClass =
		"inline-block border border-[#777] px-7 py-3 text-[0.8rem] font-medium uppercase tracking-[0.08em] text-[#ccc] transition hover:border-[#c4763e] hover:text-[#c4763e]";

	const services = [
		{
			id: 1,
			icon: "🏗",
			title: "Post-Civil Construction",
			description:
				"Expert finishing work on completed structures. From interior walls to exterior finishes, we ensure impeccable quality.",
			features: [
				"Interior Finishing",
				"Exterior Cladding",
				"Flooring",
				"Painting",
			],
		},
		{
			id: 2,
			icon: "🛋",
			title: "Interior Design & Execution",
			description:
				"Transform raw spaces into beautiful homes. Our design team creates functional, aesthetic interiors tailored to your taste.",
			features: [
				"Space Planning",
				"Material Selection",
				"Furniture Design",
				"Installation",
			],
		},
		{
			id: 3,
			icon: "💧",
			title: "Plumbing & Sanitaryware",
			description:
				"Complete plumbing solutions from planning to execution. Quality fixtures, efficient systems, zero leaks guaranteed.",
			features: [
				"System Design",
				"Premium Fixtures",
				"Maintenance Support",
				"Certifications",
			],
		},
		{
			id: 4,
			icon: "⚡",
			title: "Electrical Systems",
			description:
				"State-of-the-art electrical installations meeting international standards. Safety, efficiency, smart home ready.",
			features: [
				"Wiring Systems",
				"Smart Home Setup",
				"Solar Integration",
				"Certification",
			],
		},
		{
			id: 5,
			icon: "🎨",
			title: "Custom Woodwork",
			description:
				"Bespoke carpentry and woodwork. Wardrobes, cabinets, doors — all crafted with precision and finest materials.",
			features: [
				"Custom Design",
				"Premium Wood",
				"Expert Installation",
				"Long Warranty",
			],
		},
		{
			id: 6,
			icon: "🏡",
			title: "Landscaping & Outdoor",
			description:
				"Beautiful outdoor spaces that complement your home. Gardens, patios, water features — complete outdoor solutions.",
			features: [
				"Garden Design",
				"Hardscaping",
				"Maintenance Plans",
				"Sustainability",
			],
		},
	];

	const testimonials = [
		{
			name: "Arjun Reddy",
			project: "Villa Areca, Jubilee Hills",
			text: "RJS Homes transformed our bare structure into a dream home. The attention to detail and transparency was remarkable.",
			rating: 5,
		},
		{
			name: "Priya Sharma",
			project: "Skyline Block A, Gachibowli",
			text: "From initial design to final handover, every step was communicated clearly. Outstanding craftsmanship!",
			rating: 5,
		},
		{
			name: "Vikram Patel",
			project: "Duplex Row, Kompally",
			text: "We got our custom interiors exactly as envisioned. The team's professionalism was exceptional.",
			rating: 5,
		},
	];

	return (
		<div className="min-h-screen overflow-x-hidden bg-[#0f0f0f] text-white">
			{/* NAVBAR */}
			<nav className="fixed left-0 right-0 top-0 z-[100] flex h-[60px] items-center justify-between border-b border-[#e8d9bc] bg-[rgba(249,243,232,0.92)] px-4 backdrop-blur-[12px] md:h-[68px] md:px-[5vw]">
				<a
					href="/"
					className="font-serif text-2xl font-semibold text-[#8b3a2a]"
				>
					<span className="italic text-[#c4763e]">RJS HOMES</span>
				</a>
				<div className="hidden items-center gap-8 md:flex">
					<a
						href="/"
						className="text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#6b5540] transition-colors hover:text-[#8b3a2a]"
					>
						Home
					</a>
					<a
						href="#services"
						className="text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#6b5540] transition-colors hover:text-[#8b3a2a]"
					>
						Services
					</a>
					<a
						href="#testimonials"
						className="text-[0.8rem] font-medium uppercase tracking-[0.1em] text-[#6b5540] transition-colors hover:text-[#8b3a2a]"
					>
						Testimonials
					</a>
					<button
						className="border-0 bg-[#8b3a2a] px-6 py-2 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-[#fdfaf5] transition hover:bg-[#b35942]"
						onClick={() => navigate("/login")}
					>
						Portal →
					</button>
				</div>
			</nav>

			{/* HERO SECTION */}
			<section
				className="relative grid min-h-screen grid-cols-1 overflow-hidden bg-[#1a1108] pt-[60px] md:grid-cols-2 md:pt-[68px]"
				id="home"
			>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(139,58,42,0.25)_0%,transparent_60%),radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(196,118,62,0.15)_0%,transparent_50%)]"></div>
				<div className="absolute inset-0 bg-[length:60px_60px] [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]"></div>
				<div className="relative z-[2] flex flex-col justify-center px-4 py-16 md:px-[5vw] md:py-24 md:pr-16">
					<div className="mb-6 flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-[#c4763e] before:h-px before:w-8 before:bg-[#c4763e] before:content-['']">
						Complete Post-Civil Solutions
					</div>
					<h1 className="mb-2 text-[clamp(3rem,5.5vw,5.5rem)] font-light leading-[1.08] text-white">
						From Raw Space
						<br />
						<span className="italic text-[#c4763e]">
							to Your Dream Interior
						</span>
					</h1>
					<p className="mb-10 max-w-[480px] text-[1.05rem] leading-[1.6] text-[#ccc]">
						We specialize in complete post-civil construction and
						interior solutions. Every project reflects our
						commitment to quality, transparency, and your vision.
					</p>
					<div className="flex flex-wrap gap-4">
						<button
							className={primaryButtonClass}
							onClick={() => navigate("/login")}
						>
							Get Started
						</button>
						<a href="#services" className={outlineButtonClass}>
							Explore Services
						</a>
					</div>
				</div>
				<div className="relative z-[2] flex items-center justify-center px-4 py-16 md:px-8">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div className="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-6 py-8 text-center backdrop-blur-[10px]">
							<div className="mb-2 text-[2.5rem] font-bold leading-none text-[#c4763e]">
								500+
							</div>
							<div className="text-[0.75rem] uppercase tracking-[0.1em] text-[#aaa]">
								Projects Completed
							</div>
						</div>
						<div className="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-6 py-8 text-center backdrop-blur-[10px]">
							<div className="mb-2 text-[2.5rem] font-bold leading-none text-[#c4763e]">
								15+
							</div>
							<div className="text-[0.75rem] uppercase tracking-[0.1em] text-[#aaa]">
								Years Excellence
							</div>
						</div>
						<div className="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-6 py-8 text-center backdrop-blur-[10px]">
							<div className="mb-2 text-[2.5rem] font-bold leading-none text-[#c4763e]">
								99%
							</div>
							<div className="text-[0.75rem] uppercase tracking-[0.1em] text-[#aaa]">
								Client Satisfaction
							</div>
						</div>
						<div className="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-6 py-8 text-center backdrop-blur-[10px]">
							<div className="mb-2 text-[2.5rem] font-bold leading-none text-[#c4763e]">
								100%
							</div>
							<div className="text-[0.75rem] uppercase tracking-[0.1em] text-[#aaa]">
								Quality Assured
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* SERVICES SECTION */}
			<section
				className="bg-[#0f0f0f] px-4 py-24 md:px-[5vw]"
				id="services"
			>
				<div className={sectionHeaderClass}>
					<h2>Our Complete Service Suite</h2>
					<p>
						Every aspect of your construction and interior needs,
						handled with expertise and care.
					</p>
				</div>

				<div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
					{services.map((service) => (
						<div
							key={service.id}
							className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-8 py-10 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c4763e] hover:bg-[rgba(255,255,255,0.06)]"
						>
							<div className="mb-4 text-5xl">{service.icon}</div>
							<h3 className="mb-2 text-3xl text-white">
								{service.title}
							</h3>
							<p className="mb-6 text-[0.95rem] leading-[1.6] text-[#aaa]">
								{service.description}
							</p>
							<div className="flex flex-wrap justify-center gap-3">
								{service.features.map((feature, i) => (
									<span
										key={i}
										className="rounded-[20px] border border-[rgba(196,118,62,0.3)] bg-[rgba(196,118,62,0.1)] px-4 py-1.5 text-xs text-[#c4763e]"
									>
										{feature}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* PROCESS SECTION */}
			<section className="bg-[#1a1a1a] px-4 py-24 md:px-[5vw]">
				<div className={sectionHeaderClass}>
					<h2>Our Process</h2>
					<p>Transparent, step-by-step approach to every project</p>
				</div>

				<div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-5">
					<div className="with-arrow border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
						<div className="mb-4 text-5xl font-bold text-[#c4763e]">
							01
						</div>
						<h4 className="mb-2 text-[1.1rem] text-white">
							Consultation
						</h4>
						<p className="text-[0.9rem] leading-[1.5] text-[#999]">
							Understand your vision, budget, and requirements in
							detail.
						</p>
					</div>
					<div className="with-arrow border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
						<div className="mb-4 text-5xl font-bold text-[#c4763e]">
							02
						</div>
						<h4 className="mb-2 text-[1.1rem] text-white">
							Design & Planning
						</h4>
						<p className="text-[0.9rem] leading-[1.5] text-[#999]">
							Create detailed designs and material specifications
							for approval.
						</p>
					</div>
					<div className="with-arrow border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
						<div className="mb-4 text-5xl font-bold text-[#c4763e]">
							03
						</div>
						<h4 className="mb-2 text-[1.1rem] text-white">
							Execution
						</h4>
						<p className="text-[0.9rem] leading-[1.5] text-[#999]">
							Skilled teams execute with precision, real-time
							updates provided.
						</p>
					</div>
					<div className="with-arrow border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
						<div className="mb-4 text-5xl font-bold text-[#c4763e]">
							04
						</div>
						<h4 className="mb-2 text-[1.1rem] text-white">
							Quality Check
						</h4>
						<p className="text-[0.9rem] leading-[1.5] text-[#999]">
							Rigorous inspection and testing before handover.
						</p>
					</div>
					<div className="border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
						<div className="mb-4 text-5xl font-bold text-[#c4763e]">
							05
						</div>
						<h4 className="mb-2 text-[1.1rem] text-white">
							Handover
						</h4>
						<p className="text-[0.9rem] leading-[1.5] text-[#999]">
							Complete project handover with warranty and support.
						</p>
					</div>
				</div>
			</section>

			{/* TESTIMONIALS SECTION */}
			<section
				className="bg-[#0f0f0f] px-4 py-24 md:px-[5vw]"
				id="testimonials"
			>
				<div className={sectionHeaderClass}>
					<h2>What Our Clients Say</h2>
					<p>
						Real experiences from homeowners who trusted us with
						their dreams
					</p>
				</div>

				<div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-8 md:grid-cols-3">
					{testimonials.map((testimonial, i) => (
						<div
							key={i}
							className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-8"
						>
							<div className="mb-4 text-xl">
								{"⭐".repeat(testimonial.rating)}
							</div>
							<p className="mb-6 text-base italic leading-[1.7] text-[#ccc]">
								"{testimonial.text}"
							</p>
							<div>
								<h4 className="mb-1 text-[0.95rem] text-[#c4763e]">
									{testimonial.name}
								</h4>
								<p className="text-[0.85rem] text-[#777]">
									{testimonial.project}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* CTA SECTION */}
			<section className="bg-[linear-gradient(135deg,rgba(139,58,42,0.2)_0%,rgba(196,118,62,0.1)_100%)] px-4 py-20 text-center md:px-[5vw]">
				<h2 className="mb-4 text-5xl text-white">
					Ready to Transform Your Space?
				</h2>
				<p className="mb-8 text-[1.1rem] text-[#aaa]">
					Let's discuss your project. We're excited to bring your
					vision to life.
				</p>
				<button
					className="border-0 bg-[#8b3a2a] px-10 py-4 text-[0.9rem] font-medium uppercase tracking-[0.08em] text-[#fdfaf5] transition hover:bg-[#b35942]"
					onClick={() => navigate("/login")}
				>
					Start Your Journey
				</button>
			</section>

			{/* FOOTER */}
			<footer className="border-t border-[#1a1a1a] bg-black px-4 pb-8 pt-12 md:px-[5vw]">
				<div className="mx-auto mb-8 grid max-w-[1200px] grid-cols-1 gap-8 md:grid-cols-3">
					<div>
						<h4 className="mb-4 text-base font-semibold text-[#c4763e]">
							RJS HOMES
						</h4>
						<p className="text-[0.85rem] leading-[1.6] text-[#aaa]">
							Complete post-civil construction and interior
							solutions.
						</p>
					</div>
					<div>
						<h4 className="mb-4 text-base font-semibold text-[#c4763e]">
							Quick Links
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="/"
									className="text-[0.85rem] text-[#aaa] transition hover:text-[#c4763e]"
								>
									Home
								</a>
							</li>
							<li>
								<a
									href="#services"
									className="text-[0.85rem] text-[#aaa] transition hover:text-[#c4763e]"
								>
									Services
								</a>
							</li>
							<li>
								<a
									href="#testimonials"
									className="text-[0.85rem] text-[#aaa] transition hover:text-[#c4763e]"
								>
									Testimonials
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-4 text-base font-semibold text-[#c4763e]">
							Contact
						</h4>
						<p className="text-[0.85rem] leading-[1.6] text-[#aaa]">
							hello@rjshomes.com
						</p>
						<p className="text-[0.85rem] leading-[1.6] text-[#aaa]">
							+91 95 9999 8888
						</p>
					</div>
				</div>
				<div className="border-t border-[#1a1a1a] pt-8 text-center text-[0.8rem] text-[#555]">
					<p>&copy; 2024 RJS Homes. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
