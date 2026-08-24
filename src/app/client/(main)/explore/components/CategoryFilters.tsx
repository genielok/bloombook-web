import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface Pros {
  category: {
    label: string;
    value: string;
  }[];
  defaulValue: string;
  onCategoryChange: (value: string) => void;
}
export const CategoryFilters = (props: Pros) => {
  const { category: categories, defaulValue = "", onCategoryChange } = props;
  return (
    <Tabs
      defaultValue={defaulValue}
      className="w-full"
      onValueChange={(value: string) => onCategoryChange(value)}
    >
      <TabsList
        className="
          h-auto 
          bg-transparent p-0
        "
      >
        {categories.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="
                            mr-3
                            px-[22px]
                            py-[22px]
                            rounded-full
                            border border-bloom-border bg-white text-[#4a4540]
                            text-sm 
                            font-semibold 
                            cursor-pointer
                            data-[state=active]:border-[#211b17]
                            data-[state=active]:bg-[#211b17]
                            data-[state=active]:text-white
            "
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
