"use client";
import { IStudio } from '@/app/api/explore';
import { Button } from '@/components/ui/button'


export interface CardPros {
    studio: IStudio,
    active?: boolean
    onBookClick: (id: string) => void
}

const stripeActive = {
    background: "repeating-linear-gradient(45deg,#EFE0D0,#EFE0D0 14px,#E7D6C3 14px,#E7D6C3 28px)",
};

const stripeDim = {
    background: "repeating-linear-gradient(45deg,#ECE4DA,#ECE4DA 14px,#E3D9CD 14px,#E3D9CD 28px)",
};

export const Card = (props: CardPros) => {
    const { studio, active = true, onBookClick } = props

    return (
        <div
            key={studio.name}
            className="block border-[1.6px] rounded-[12px] border-bloom-soft overflow-hidden bg-white shadow-[0_14px_34px_rgba(201,149,106,.16)] hover:border-bloom-accent"
        >
            <div style={active ? stripeActive : stripeDim} className="relative h-[200px] flex items-end p-3.5">

            </div>
            <div className="px-[22px] pt-5 pb-[22px]">
                <div className="flex justify-between items-start">
                    <div className="font-display text-[23px] leading-[1.1]">{studio.name}</div>
                    <div className="flex items-center gap-[5px] text-sm font-semibold">
                        <span className="text-bloom-accent">★</span> {studio.rating}
                    </div>
                </div>
                <div className="text-sm text-bloom-subtle mt-1.5">{studio.location}</div>
                <div className="flex gap-[7px] mt-4 flex-wrap">
                    {
                        studio.services?.map((service, index) => (
                            <span key={index} className="text-xs text-bloom-accent-dark bg-bloom-soft border border-[#EADFD2] px-[11px] py-[5px] rounded-full">
                                {service}
                            </span>
                        ))
                    }

                </div>
                <div className="flex justify-between items-center mt-[18px] pt-4 border-t border-bloom-border">
                    {
                        studio.availableToday ? (
                            <span className="text-[13px] text-bloom-success font-semibold">Available today</span>
                        ) : (
                            <span className="text-[13px] text-bloom-error font-semibold">Not available today</span>
                        )
                    }
                    <Button
                        onClick={() => onBookClick(studio.id)}
                        className="px-[18px] py-[20px] rounded-[999px] font-bold  text-bloom-bg "
                    > Book Now
                    </Button>
                </div>
            </div>
        </div>
    )
}
