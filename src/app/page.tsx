import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Default Landing Title",
    description: "Default description",
    openGraph: {
      title: "Default Open Graph",
      description: "Default Open Graph",
    },
  };
}

export default async function LandingPage() {
  return (
    <>
      <p className="text-blue-500">первая страница</p>
      <Button>нажми на меня</Button>
    </>
  );
}
