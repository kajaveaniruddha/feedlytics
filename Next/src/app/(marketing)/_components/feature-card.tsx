interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    clients?: string[];
}

function FeatureCard({ icon, title, description, clients = [] }: FeatureCardProps) {
    return (
        <div
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.3]"></div>

            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-500 rounded-xl opacity-0 group-hover:opacity-15 blur-xl transition-all duration-300"></div>

            <div className="relative p-8 z-10">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary to-muted shadow-md w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary">{icon}</div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors mb-5 leading-relaxed">{description}</p>

                {clients.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-3 font-medium">Trusted by:</p>
                        <div className="flex flex-wrap gap-2">
                            {clients.map((client, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                                >
                                    {client}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl"></div>
            </div>
        </div>
    )
}
export default FeatureCard
