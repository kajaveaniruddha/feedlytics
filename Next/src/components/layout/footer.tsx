import Link from "next/link"
import React from "react"

const Footer = () => {
    return (
        <footer className="py-12 px-4 bg-secondary border-t border-border">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold">FEEDLYTICS</h3>
                    <p className="text-muted-foreground text-sm">© 2024 Feedlytics. All rights reserved.</p>
                </div>
                <div className="flex flex-wrap gap-6 md:gap-8">
                    <Link
                        href="/about"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/privacy-policy"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms-and-conditions"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Terms & Conditions
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/aniruddhakajave/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
