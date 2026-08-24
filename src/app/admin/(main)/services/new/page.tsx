"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  adminServices,
  type ServiceCategory,
} from "../../components/services-data";

const categories: ServiceCategory[] = ["Nails", "Skin", "Brows & Lashes"];

const staffByCategory: Record<ServiceCategory, Array<{ name: string; color: string }>> = {
  Nails: [
    { name: "Mara Voss", color: "bg-[#f4ebe2]" },
    { name: "Lena Hoffmann", color: "bg-[#e6f0e8]" },
    { name: "Emma Richter", color: "bg-[#efe0d0]" },
  ],
  Skin: [{ name: "Sophia Lindqvist", color: "bg-[#e0e7f0]" }],
  "Brows & Lashes": [
    { name: "Sophia Lindqvist", color: "bg-[#e0e7f0]" },
  ],
};

export default function AdminNewServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingService = useMemo(
    () =>
      adminServices.find(
        (service) => service.id === searchParams.get("service"),
      ),
    [searchParams],
  );
  const [name, setName] = useState(editingService?.name ?? "");
  const [categoryOptions, setCategoryOptions] = useState<string[]>(categories);
  const [category, setCategory] = useState<string>(
    editingService?.category ?? "Nails",
  );
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [duration, setDuration] = useState(
    editingService?.duration.toString() ?? "45",
  );
  const [price, setPrice] = useState(editingService?.price.toString() ?? "");
  const [description, setDescription] = useState(
    editingService?.description ?? "",
  );
  const [active, setActive] = useState(editingService?.active ?? true);
  const assignedStaff = editingService
    ? staffByCategory[category as ServiceCategory] ?? []
    : [];

  const submitService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/admin/services");
  };

  const addCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCategory = newCategory.trim();
    if (!normalizedCategory) return;

    const existingCategory = categoryOptions.find(
      (item) => item.toLowerCase() === normalizedCategory.toLowerCase(),
    );
    const nextCategory = existingCategory ?? normalizedCategory;

    if (!existingCategory) {
      setCategoryOptions((current) => [...current, normalizedCategory]);
    }
    setCategory(nextCategory);
    setNewCategory("");
    setCategoryDialogOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Button asChild variant="link" className="mb-4 h-auto gap-1.5 px-0 text-[13px] font-semibold text-bloom-accent-dark">
        <Link href="/admin/services">
          <ArrowLeft /> All services
        </Link>
      </Button>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,1fr)]">
        <Card className="gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
          <CardContent className="px-6 py-6">
            <form onSubmit={submitService} className="flex flex-col gap-4">
              <ServiceField label="Service name" htmlFor="service-name">
                <Input
                  id="service-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="e.g. Gel Manicure"
                  className="h-10 border-bloom-border bg-white px-3 text-sm shadow-none"
                />
              </ServiceField>

              <div className="grid gap-3 sm:grid-cols-3">
                <ServiceField label="Category">
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      if (value === "__add_category__") {
                        setCategoryDialogOpen(true);
                        return;
                      }
                      setCategory(value);
                    }}
                  >
                    <SelectTrigger className="h-10 w-full border-bloom-border bg-white text-sm shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                      <SelectSeparator />
                      <SelectItem value="__add_category__">
                        <Plus className="text-bloom-accent-dark" />
                        Add new category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </ServiceField>
                <ServiceField label="Duration (minutes)" htmlFor="duration">
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    required
                    className="h-10 border-bloom-border bg-white px-3 text-sm shadow-none"
                  />
                </ServiceField>
                <ServiceField label="Price (€)" htmlFor="price">
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    required
                    className="h-10 border-bloom-border bg-white px-3 text-sm shadow-none"
                  />
                </ServiceField>
              </div>

              <ServiceField label="Description" htmlFor="description">
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe what is included in this service…"
                  className="min-h-20 resize-y border-bloom-border bg-white px-3 py-2.5 text-sm shadow-none"
                />
              </ServiceField>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  onClick={() => setActive((value) => !value)}
                  variant="ghost"
                  className={`relative h-5 w-9 rounded-full p-0 ${active ? "bg-[#7bae8a] hover:bg-[#7bae8a]" : "bg-[#e4e4e7] hover:bg-[#e4e4e7]"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${active ? "translate-x-4" : "translate-x-0"}`} />
                </Button>
                <span className="text-[13px] font-semibold text-bloom-text">
                  Active — bookable by customers
                </span>
              </div>

              <div className="mt-1 flex gap-2.5">
                <Button type="submit" className="h-10 bg-bloom-text px-5 text-[13px] font-semibold text-bloom-bg hover:bg-bloom-text/90">
                  Save service
                </Button>
                <Button asChild variant="outline" className="h-10 border-bloom-border bg-white px-5 text-[13px] font-semibold shadow-none">
                  <Link href="/admin/services">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-[10px] border border-bloom-border bg-white py-0 shadow-none ring-0">
          <CardHeader className="gap-1 px-[22px] pt-5 pb-3.5">
            <CardTitle className="text-sm font-semibold">
              Staff providing this service
            </CardTitle>
            <p className="text-xs text-bloom-subtle">
              Manage assignment from each staff member&apos;s profile.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 px-[22px] pb-5">
            {assignedStaff.length ? (
              assignedStaff.map((member) => (
                <div key={member.name} className="flex items-center gap-2.5 rounded-lg border border-[#f0e9e1] px-3 py-2.5">
                  <Avatar className={`size-7 after:border-0 ${member.color}`}>
                    <AvatarFallback className={`text-[11px] font-bold text-bloom-text ${member.color}`}>
                      {member.name.split(" ").map((part) => part[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] font-semibold">{member.name}</span>
                </div>
              ))
            ) : (
              <p className="py-2 text-[13px] text-bloom-subtle">
                No staff assigned yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <form onSubmit={addCategory}>
            <DialogHeader>
              <DialogTitle>Add new category</DialogTitle>
              <DialogDescription>
                Create a category for organizing your bookable services.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label
                htmlFor="new-category"
                className="mb-2 text-xs font-normal text-bloom-subtle"
              >
                Category name
              </Label>
              <Input
                id="new-category"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="e.g. Massage"
                autoFocus
                required
                className="h-10 border-bloom-border bg-white px-3 text-sm shadow-none"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-bloom-text text-bloom-bg hover:bg-bloom-text/90"
              >
                Add category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-normal text-bloom-subtle">
        {label}
      </Label>
      {children}
    </div>
  );
}
