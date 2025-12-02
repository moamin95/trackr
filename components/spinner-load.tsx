import { Spinner } from "@/components/ui/spinner";

export function SpinnerColor() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="size-12 text-blue-500" />
    </div>
  );
}
