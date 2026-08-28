import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FilterSelectProps = {
  value: string;
  label: string;
  items: readonly string[];
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  getItemLabel?: (item: string) => string;
};

export function FilterSelect({
  value,
  label,
  items,
  onChange,
  id,
  name,
  required,
  placeholder,
  className,
  getItemLabel,
}: FilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      name={name}
      required={required}
    >
      <SelectTrigger
        id={id}
        aria-label={label}
        className={cn(
          "h-9 border-bloom-border bg-white text-[13px] shadow-none focus-visible:border-bloom-accent focus-visible:ring-bloom-accent/20",
          className,
        )}
      >
        <SelectValue placeholder={placeholder ?? label} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item} value={item}>
            {item === "All" ? label : (getItemLabel?.(item) ?? item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
