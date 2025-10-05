import { cn } from "@/lib/utils"

export function Toaster() {
  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-0 sm:right-0 sm:flex-col md:max-w-[420px]"
      )}
    >
      {/* Toast notifications will be rendered here */}
    </div>
  )
}