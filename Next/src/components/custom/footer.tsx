import Link from 'next/link'
import React from 'react'

type Props = {}

const Footer = (props: Props) => {
    return (
        < footer className="py-12 px-4 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800" >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold">FEEDLYTICS</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">© 2024 Feedlytics. All rights reserved.</p>
                </div>
                <div className="flex gap-8">
                    <Link
                        href="/privacy"
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                        Terms
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/aniruddhakajave/"
                        className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </footer >
    )
}

export default Footer