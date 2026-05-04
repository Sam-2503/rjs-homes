import { useState } from "react";
import { cn } from "../../utils/cn";

type ProjectType = "all" | "villa" | "apartment" | "duplex" | "commercial";

const projects = [
	{
		id: 1,
		type: "villa",
		name: "Villa Areca",
		location: "Jubilee Hills, Hyderabad",
		units: "24 residences",
		price: "INR 85L - 1.2Cr",
		status: "In Progress",
		description:
			"Luxury gated villas with structured delivery phases and premium interior detailing.",
	},
	{
		id: 2,
		type: "apartment",
		name: "Skyline Block A",
		location: "Gachibowli, Hyderabad",
		units: "120 residences",
		price: "INR 45L - 75L",
		status: "Active",
		description:
			"Mid-rise residential block with optimized plans and end-to-end construction management.",
	},
	{
		id: 3,
		type: "duplex",
		name: "Duplex Row Phase 1",
		location: "Kompally, Hyderabad",
		units: "36 residences",
		price: "INR 65L - 90L",
		status: "In Progress",
		description:
			"Contemporary duplex homes focused on efficient planning and high-value material selection.",
	},
	{
		id: 4,
		type: "villa",
		name: "Green Meadows",
		location: "Shamirpet, Hyderabad",
		units: "48 residences",
		price: "INR 1.1Cr - 1.8Cr",
		status: "New Launch",
		description:
			"Low-density villa cluster designed around open space, privacy, and long-term livability.",
	},
	{
		id: 5,
		type: "commercial",
		name: "Commercial Hub",
		location: "HITEC City, Hyderabad",
		units: "18 spaces",
		price: "INR 1.5Cr - 3Cr",
		status: "Delivered",
		description:
			"Commercial development with robust services planning and grade-A finishing packages.",
	},
	{
		id: 6,
		type: "apartment",
		name: "Emerald Heights",
		location: "Miyapur, Hyderabad",
		units: "96 residences",
		price: "INR 38L - 62L",
		status: "New Launch",
		description:
			"Urban apartment community with schedule-led coordination and digital progress tracking.",
	},
] as const;

const statusClassMap: Record<string, string> = {
	"in progress": "bg-[#9f7a3a]/20 text-[#e8cf9f] border-[#c9aa72]/35",
	active: "bg-[#44668d]/24 text-[#bcd0e8] border-[#6f8fb2]/35",
	"new launch": "bg-[#2f6f5f]/24 text-[#a9dccf] border-[#57a28f]/35",
	delivered: "bg-[#5f6f83]/24 text-[#d0dae8] border-[#8796ac]/35",
};

export default function Projects() {
	const [projectFilter, setProjectFilter] = useState<ProjectType>("all");

	const filteredProjects =
		projectFilter === "all"
			? projects
			: projects.filter((p) => p.type === projectFilter);

	return (
		<section className="px-4 py-24 md:px-8" id="projects">
			<div className="mx-auto max-w-[1280px]">
				<div className=" gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<div className="text-[11px] uppercase tracking-[0.18em] text-[#c9aa72]">
							Featured Portfolio
						</div>
						<h2 className="mt-2 text-[clamp(2rem,3.7vw,3.2rem)] text-[#f4eee4]">
							Projects Built with Technical Discipline
						</h2>
					</div>
					<p className="max-w-[450px] text-[0.95rem] leading-7 text-[#adbacf]">
						Each site is managed with milestone-driven coordination,
						structured quality checks, and a clear owner-side
						reporting cycle.
					</p>
				</div>

				<div className="mt-8 flex flex-wrap gap-3">
					{(
						[
							"all",
							"villa",
							"apartment",
							"duplex",
							"commercial",
						] as const
					).map((filter) => (
						<button
							key={filter}
							type="button"
							className={cn(
								"rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition",
								projectFilter === filter
									? "border-[#c9aa72]/40 bg-[#c9aa72] text-[#111a26]"
									: "border-white/15 bg-white/5 text-[#d1d8e2] hover:border-[#c9aa72]/40 hover:text-[#f3e7d1]",
							)}
							onClick={() => setProjectFilter(filter)}
						>
							{filter}
						</button>
					))}
				</div>

				<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
					{filteredProjects.map((project) => {
						const statusClass =
							statusClassMap[project.status.toLowerCase()] ??
							statusClassMap.active;

						return (
							<article
								key={project.id}
								className="rounded-xl border border-white/10 bg-[linear-gradient(165deg,rgba(11,19,31,0.95)_0%,rgba(17,29,45,0.95)_100%)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c9aa72]/35"
							>
								<div className="rounded-lg border border-white/10 bg-[linear-gradient(130deg,rgba(201,170,114,0.2)_0%,rgba(43,74,108,0.25)_100%)] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[#e6d5b6]">
									{project.location}
								</div>
								<h3 className="mt-4 text-2xl text-[#f4eee3]">
									{project.name}
								</h3>
								<p className="mt-2 text-sm leading-7 text-[#aeb9ca]">
									{project.description}
								</p>

								<div className="mt-4 grid grid-cols-2 gap-3 text-sm">
									<div className="rounded-md border border-white/10 bg-white/5 p-3 text-[#d5dce8]">
										<div className="text-[10px] uppercase tracking-[0.12em] text-[#99a7bc]">
											Inventory
										</div>
										<div className="mt-1">
											{project.units}
										</div>
									</div>
									<div className="rounded-md border border-white/10 bg-white/5 p-3 text-[#d5dce8]">
										<div className="text-[10px] uppercase tracking-[0.12em] text-[#99a7bc]">
											Price Range
										</div>
										<div className="mt-1">
											{project.price}
										</div>
									</div>
								</div>

								<div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
									<span
										className={cn(
											"rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
											statusClass,
										)}
									>
										{project.status}
									</span>
									<a
										href="#contact"
										className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d8bc8f]"
									>
										Request Details
									</a>
								</div>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
