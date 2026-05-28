import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center min-h-screen">
      landing Page
      <Link href="/dashboard/assignments" className="bg-primary text-primary-foreground px-8 py-3 rounded-full flex gap-2">
        Dashboard <ExternalLinkIcon />
      </Link>
    </div>
  );
}
