import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-rose-vif" />
      <span className="ml-2 text-lg text-muted-foreground">Chargement...</span>
    </div>
  );
}

// Alternative minimal version (uncomment to use instead):
// export default function Loading() {
//   return null;
// }