"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface SuccessContentProps {
    customerEmail: string
}

export default function SuccessContent({ customerEmail }: SuccessContentProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2,
                        }}
                        className="flex justify-center mb-4"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </motion.div>
                    <CardTitle className="text-center text-2xl font-bold">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground"
                    >
                        Thank you for your purchase! W&apos;ve sent a confirmation email to{" "}
                        <span className="font-medium text-foreground">{customerEmail}</span>
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-muted p-4 rounded-lg text-sm"
                    >
                        <p>
                            If you have any questions about your order, please email{" "}
                            <a href="mailto:aakajave@gmail.com" className="text-primary font-medium hover:underline">
                                aakajave@gmail.com
                            </a>
                        </p>
                    </motion.div>
                </CardContent>
                <CardFooter className="flex justify-center pt-2 pb-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                        <Button asChild>
                            <Link href="/dashboard">Continue to Feedlytics</Link>
                        </Button>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
