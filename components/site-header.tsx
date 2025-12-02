import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader({ title }: { title?: string }) {
  return (
    <header
      className="
        sticky top-0 z-50
        flex shrink-0 items-center gap-2
          backdrop-blur
        transition-[width,height] ease-linear"
    >
      <div className="flex w-full items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-2xl font-semibold tracking-tighter">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link
              href="https://github.com/moamin95"
              target="_blank"
              rel="noopener"
            >
              GitHub
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
