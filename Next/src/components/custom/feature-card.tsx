interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    clients?: string[];
}

function FeatureCard({ icon, title, description, clients = [] }: FeatureCardProps) {
    return (
        <div
            className="group relative overflow-hidden rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Gradient background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4]"></div>

            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>

            <div className="relative p-8 z-10">
                {/* Icon with gradient background */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 shadow-md w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-purple-500 dark:text-purple-400">{icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 dark:text-neutral-300">
                    {title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 dark:group-hover:text-neutral-300 transition-colors mb-5 leading-relaxed">{description}</p>

                {clients.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3 font-medium">Trusted by:</p>
                        <div className="flex flex-wrap gap-2">
                            {clients.map((client, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50"
                                >
                                    {client}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-3xl"></div>
            </div>
        </div>
    )
}
export default FeatureCard