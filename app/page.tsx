"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">

          {/* Location */}
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-white/75">
            Tawi-Tawi
          </p>

          {/* Main Heading */}
          <h1 className="text-5xl font-extrabold tracking-[-0.03em] text-[#FFF9F2] sm:text-6xl md:text-7xl">
            Explore Tawi-Tawi
          </h1>

          {/* Description */}
<p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-7 tracking-wide text-[#FFF9F2]/90 sm:text-lg md:text-xl">
            Discover barangays, locations, population information,
            and geographic data through an interactive map of
            Tawi-Tawi.
          </p>

          {/* Button */}
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="gap-2 rounded-full px-7 text-base font-semibold shadow-xl"
              onClick={() => router.push("/map")}
            >
              <Map className="size-5" />
              Explore Map
            </Button>
          </div>

          {/* Disclaimer */}
      <p className="mx-auto mt-6  text-base font-normal leading-5 tracking-wide text-[#FFF9F2]/90 sm:text-lg">
            This is a personal project created for educational and
            portfolio purposes. It is not affiliated with, intended
            to replace, or intended to compete with any government
            mapping, demographic, or geographic information system.
            Information presented on this website may differ from
            official government data.
          </p>

        </div>
      </div>

    </main>
  );
}