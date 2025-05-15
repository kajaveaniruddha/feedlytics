import { redirect } from "next/navigation"
import { Suspense } from "react"
import { stripe } from "@/lib/stripe"
import SuccessContent from "@/components/custom/success-content"


interface SuccessPageProps {
  searchParams: Promise<{ session_id: string }>
}

export default async function Success({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)")
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })

    const { status, customer_details } = session

    if (status === "open") {
      return redirect("/")
    }

    if (status === "complete" && customer_details?.email) {
      return (
        <div className="container flex items-center justify-center min-h-[80vh] py-12">
          <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent customerEmail={customer_details.email} />
          </Suspense>
        </div>
      )
    }
  } catch (error) {
    console.error("Error retrieving session:", error)
    return redirect("/dashboard")
  }

  // Fallback in case status is neither open nor complete
  return redirect("/")
}
