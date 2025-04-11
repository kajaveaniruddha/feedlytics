"use client"
import { motion } from 'framer-motion'
import React from 'react'

type Props = {
    children: React.ReactNode;
    className: string
}

const MotionDiv = ({ children, className }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
            }} className={className}>{children}</motion.div>
    )
}

export default MotionDiv