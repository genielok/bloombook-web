"use client";
import { IStudio } from "@/app/api/clients/types";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/lib/func";
import Image from "next/image";

export interface CardPros {
  studio: IStudio;
  active?: boolean;
  onBookClick: (id: string) => void;
}

export const Card = (props: CardPros) => {
  const { studio, onBookClick } = props;
  console.log(getAssetUrl(studio.imgUrl));

  return (
    <div
      key={studio.name}
      className="block border-[1.6px] rounded-[12px] border-bloom-soft overflow-hidden bg-white shadow-[0_14px_34px_rgba(201,149,106,.16)] hover:border-bloom-accent"
    >
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          fill
          src={getAssetUrl(studio.imgUrl)}
          alt={studio.name}
          className="object-cover"
        />
      </div>
      <div className="px-[22px] pt-5 pb-[22px]">
        <div className="flex justify-between items-start">
          <div className="font-display text-[23px] leading-[1.1]">
            {studio.name}
          </div>
          {/* <div className="flex items-center gap-[5px] text-sm font-semibold">
            <span className="text-bloom-accent">★</span> {studio.rating}
          </div> */}
        </div>
        <div className="text-sm text-bloom-subtle mt-1.5">
          {studio.address} , {studio.city}
        </div>
        <div className="flex gap-[7px] mt-4 flex-wrap">
          {studio.services?.map((service, index) => (
            <span
              key={index}
              className="text-xs text-bloom-accent-dark bg-bloom-soft border border-[#EADFD2] px-[11px] py-[5px] rounded-full"
            >
              {service}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-[18px] pt-4 border-t border-bloom-border">
          <Button
            onClick={() => onBookClick(studio.id)}
            className="px-[18px] py-[20px] rounded-[999px] font-bold  text-bloom-bg "
          >
            {" "}
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};
