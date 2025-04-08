import { Skeleton } from "@/components/ui/skeleton"

const GroupsListSkeleton = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GroupsListSkeleton