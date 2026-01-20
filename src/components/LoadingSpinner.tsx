import { Cloud } from "lucide-react";

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Cloud className="w-16 h-16 text-primary animate-pulse mb-4" />
      {message && (
        <p className="text-muted-foreground">{message}</p>
      )}
    </div>
  );
}