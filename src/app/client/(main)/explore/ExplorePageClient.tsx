"use client";
import { useEffect, useState } from "react";
import { Card } from "./components/Card";
import { CategoryFilters } from "./components/CategoryFilters";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ECategory,
  IStudio,
  SearchStudioParams,
} from "@/app/api/clients/types";
import { getStudios } from "@/app/api/clients/client";

const INITIAL_SEARCH_TEXT: SearchStudioParams = {
  searchText: "",
  location: "",
  category: "all",
};

const CATEGORIES: { label: string; value: string }[] = Object.keys(
  ECategory,
).map((key) => ({
  label: Object.values(ECategory).find((value) => value === key) || key,
  value: key,
}));

export function ExplorePageClient() {
  const router = useRouter();

  const [studioList, setStudioList] = useState<IStudio[]>([]);
  const [total, setTotal] = useState(0);
  const [isFetchingStudios, setIsFetchingStudios] = useState(true);
  const [location] = useState({
    city: "Berlin",
    country: "DE",
  });
  const [searchText, setSearchText] = useState(INITIAL_SEARCH_TEXT);

  useEffect(() => {
    fetchStudios(INITIAL_SEARCH_TEXT);
  }, []);

  async function fetchStudios(params: SearchStudioParams) {
    setIsFetchingStudios(true);
    try {
      const curParams = {
        ...params,
        category: params.category === "all" ? undefined : params.category,
      };

      const data = await getStudios(curParams);

      setStudioList(data.data);
      setTotal(data.total);
    } catch (error) {
      console.log("Failed to fetch studios:", error);
    } finally {
      setIsFetchingStudios(false);
    }
  }

  const handleBook = (id: string) => {
    router.push(`/client/detailPage/${id}`);
  };

  const handleCategoryChange = (value: string) => {
    setSearchText({ ...searchText, category: value });
    fetchStudios({ ...searchText, category: value });
  };

  return (
    <>
      {/* HERO + SEARCH */}
      <section className="px-16 pt-16 pb-10">
        <p className="text-[13px] tracking-[0.16em] uppercase text-bloom-accent-dark mb-[18px]">
          Find your studio
        </p>
        <h1 className="font-display font-medium text-[60px] leading-[1.02] tracking-[-0.015em] m-0 max-w-[760px]">
          Book beauty you&apos;ll <em>love</em>, near you.
        </h1>
        <p className="text-[18px] text-bloom-muted mt-5 max-w-[520px]">
          Discover independent nail, hair and beauty studios across Europe — and
          book in seconds.
        </p>

        <div className="mt-9 grid max-w-[780px] grid-cols-2">
          {/* Left: Service */}
          <div
            className="
                            relative z-0
                            flex items-center gap-3
                            rounded-l-full border border-bloom-border bg-white
                            px-6 py-4
                            focus-within:z-10
                            focus-within:border-bloom-accent
                            "
          >
            <span className="text-[17px] text-bloom-accent">✦</span>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] tracking-[0.08em] uppercase text-bloom-subtle">
                Service or salon
              </div>

              <Input
                className="!h-auto !border-0 !bg-transparent !p-0 !shadow-none !ring-0 focus-visible:!ring-0"
                placeholder="search..."
                value={searchText.searchText}
                onChange={(e) =>
                  setSearchText({ ...searchText, searchText: e.target.value })
                }
              />
            </div>
          </div>

          {/* Right: Location + Search */}
          <div
            className="
                            relative z-0 -ml-px
                            flex items-stretch
                            rounded-r-full border border-bloom-border bg-white
                            overflow-hidden
                            focus-within:z-10
                            focus-within:border-bloom-accent
                            "
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-6 py-4">
              <span className="text-[17px] text-bloom-accent">◎</span>

              <div className="min-w-0 flex-1">
                <div className="text-[11px] tracking-[0.08em] uppercase text-bloom-subtle">
                  Location
                </div>

                <Input
                  className="!h-auto !border-0 !bg-transparent !p-0 !shadow-none !ring-0 focus-visible:!ring-0"
                  placeholder="search..."
                  value={searchText.location}
                  onChange={(e) =>
                    setSearchText({ ...searchText, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-none p-[7px]">
              <Button
                disabled={isFetchingStudios}
                className="
                                h-full rounded-full border-0
                                bg-bloom-accent px-[30px]
                                text-[15px] font-semibold text-bloom-bg
                                "
                onClick={() => fetchStudios(searchText)}
              >
                {isFetchingStudios ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="px-16 pt-2">
        <div className="flex gap-3 items-center border-b border-bloom-border pb-6">
          <CategoryFilters
            category={CATEGORIES}
            defaulValue="all"
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* RESULTS */}
      <section className="px-16 pt-8 pb-[72px]">
        <div className="flex justify-between items-baseline mb-6">
          <div className="font-display text-[26px]">
            {isFetchingStudios
              ? `Searching studios near ${location.city}`
              : `${total} studios near ${location.city}`}
          </div>
          <div className="flex items-center gap-2 text-sm text-bloom-subtle">
            Sort by{" "}
            <span className="text-bloom-text font-semibold">Recommended ▾</span>
          </div>
        </div>

        {isFetchingStudios ? (
          <div className="grid grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[386px] animate-pulse overflow-hidden rounded-[12px] border border-bloom-border bg-white"
              >
                <div className="h-[200px] bg-bloom-soft" />
                <div className="space-y-4 p-[22px]">
                  <div className="h-6 w-2/3 rounded bg-bloom-soft" />
                  <div className="h-4 w-1/2 rounded bg-bloom-soft" />
                  <div className="flex gap-2">
                    <div className="h-7 w-20 rounded-full bg-bloom-soft" />
                    <div className="h-7 w-24 rounded-full bg-bloom-soft" />
                  </div>
                  <div className="h-px bg-bloom-border" />
                  <div className="h-8 w-full rounded-full bg-bloom-soft" />
                </div>
              </div>
            ))}
          </div>
        ) : studioList.length > 0 ? (
          <div className="grid grid-cols-3 gap-7">
            {studioList.map((studio) => (
              <Card
                key={studio.id}
                studio={studio}
                active
                onBookClick={handleBook}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[12px] border border-bloom-border bg-white p-6 text-sm text-bloom-subtle">
            No studios found. Try another service, salon, or location.
          </div>
        )}
      </section>
    </>
  );
}
