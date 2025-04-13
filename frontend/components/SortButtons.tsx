'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";

interface SortButtonsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function SortButtons({ sortBy, onSortChange }: SortButtonsProps) {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="text-sm flex items-center text-gray-300 hover:text-white data-[active=true]:text-white"
        data-active={sortBy === "popular"}
        onClick={() => onSortChange("popular")}
      >
        인기순
        <ChevronDown className="h-4 w-4 ml-1" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-gray-300 hover:text-white data-[active=true]:text-white"
        data-active={sortBy === "newest"}
        onClick={() => onSortChange("newest")}
      >
        최신순
      </Button>
      <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-gray-300 hover:text-white data-[active=true]:text-white"
        data-active={sortBy === "difficulty"}
        onClick={() => onSortChange("difficulty")}
      >
        난이도순
      </Button>
    </div>
  );
} 