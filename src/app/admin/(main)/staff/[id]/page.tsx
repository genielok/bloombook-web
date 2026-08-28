"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import dayjs from "dayjs";
import { Check, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminService,
  SERVICE_CATEGORY_LABELS,
} from "../../components/services-data";
import {
  adminStaff,
  getStaffInitials,
  type StaffTimeOff,
} from "../../components/staff-data";
import { getServiceList } from "@/app/api/admins/admin";

export default function AdminStaffDetailPage() {
  const params = useParams<{ id: string }>();
  const [adminServices, setAdminServices] = useState<AdminService[]>([]);

  const fetchServices = async () => {
    try {
      const { data } = await getServiceList();
      setAdminServices(data);
    } catch (error) {
      console.log(error);
    }
  };
  const initialStaff = useMemo(
    () => adminStaff.find((member) => member.id === params.id),
    [params.id],
  );

  if (!initialStaff) notFound();

  const [active, setActive] = useState(initialStaff.active);
  const [serviceIds, setServiceIds] = useState(initialStaff.serviceIds);
  const [timeOff, setTimeOff] = useState(initialStaff.timeOff);

  const toggleService = (id: string) => {
    setServiceIds((current) =>
      current.includes(id)
        ? current.filter((serviceId) => serviceId !== id)
        : [...current, id],
    );
  };

  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <Link
        href="/admin/staff"
        className="mb-4 inline-flex text-[13px] font-semibold text-bloom-accent-dark hover:underline"
      >
        ← All staff
      </Link>

      <section className="flex flex-col gap-4 rounded-[10px] border border-bloom-border bg-white px-6 py-[22px] sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span
            className="flex size-[52px] shrink-0 items-center justify-center rounded-full text-base font-bold text-bloom-text"
            style={{ backgroundColor: initialStaff.avatarBg }}
          >
            {getStaffInitials(initialStaff.name)}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-xl">{initialStaff.name}</h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  active
                    ? "bg-[#e6f0e8] text-[#3f7350]"
                    : "bg-[#f4f1ec] text-bloom-subtle"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-bloom-subtle">
              {initialStaff.role} · {initialStaff.email}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setActive((current) => !current)}
          className={`border-bloom-border bg-white text-[13px] font-semibold shadow-none ${
            active ? "text-[#b0453a]" : "text-[#3f7350]"
          }`}
        >
          {active ? "Deactivate" : "Activate"}
        </Button>
      </section>

      <Tabs defaultValue="info" className="mt-6">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-6 rounded-none border-b border-bloom-border p-0"
        >
          {[
            ["info", "Info"],
            ["services", "Services"],
            ["availability", "Availability"],
            ["time-off", "Time off"],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-auto flex-none rounded-none px-0.5 pb-3 text-sm data-active:text-bloom-text after:bg-bloom-text"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="info" className="mt-5 max-w-[520px]">
          <div className="space-y-3 rounded-[10px] border border-bloom-border bg-white px-[22px] py-5 text-[13px]">
            <InfoRow label="Email" value={initialStaff.email} />
            <InfoRow label="Phone" value={initialStaff.phone} />
            <InfoRow label="Role" value={initialStaff.role} />
            <div>
              <p className="text-bloom-subtle">Bio</p>
              <p className="mt-1.5 font-medium leading-relaxed">
                {initialStaff.bio}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-5 max-w-[640px]">
          <div className="overflow-hidden rounded-[10px] border border-bloom-border bg-white">
            <p className="border-b border-[#f0e9e1] px-5 py-3.5 text-xs text-bloom-subtle">
              Select which services {initialStaff.name.split(" ")[0]} can be
              booked for.
            </p>
            {adminServices.map((service) => {
              const assigned = serviceIds.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className="flex w-full items-center justify-between border-t border-[#f0e9e1] px-5 py-3 text-left first:border-t-0 hover:bg-[#faf6f1]"
                >
                  <span>
                    <span className="block text-[13px] font-semibold">
                      {service.name}
                    </span>
                    <span className="block text-xs text-bloom-subtle">
                      {SERVICE_CATEGORY_LABELS[service.serviceCategory]} ·{" "}
                      {service.durationMinutes} min · €{service.price}
                    </span>
                  </span>
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] ${
                      assigned
                        ? "border-bloom-text bg-bloom-text"
                        : "border-bloom-border bg-white"
                    }`}
                  >
                    {assigned && <Check className="size-3 text-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="availability" className="mt-5 max-w-[480px]">
          <div className="space-y-2.5 rounded-[10px] border border-bloom-border bg-white px-[22px] py-5 text-[13px]">
            {initialStaff.hours.map((hours) => (
              <InfoRow
                key={hours.day}
                label={hours.day}
                value={
                  hours.isWorking
                    ? `${hours.start} – ${hours.end}`
                    : "Not working"
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="time-off" className="mt-5 max-w-[560px]">
          <div className="mb-3 flex justify-end">
            <AddTimeOffDialog
              onAdd={(item) => setTimeOff((current) => [...current, item])}
            />
          </div>
          <div className="overflow-hidden rounded-[10px] border border-bloom-border bg-white">
            {timeOff.length === 0 ? (
              <p className="px-8 py-8 text-center text-[13px] text-bloom-subtle">
                No time off scheduled.
              </p>
            ) : (
              timeOff.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-t border-[#f0e9e1] px-5 py-3.5 first:border-t-0"
                >
                  <div>
                    <p className="text-[13px] font-semibold">
                      {dayjs(item.date).format("dddd, D MMMM YYYY")}
                    </p>
                    <p className="mt-0.5 text-xs text-bloom-subtle">
                      {item.start ? `${item.start} – ${item.end}` : "All day"} ·{" "}
                      {item.reason}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() =>
                      setTimeOff((current) =>
                        current.filter((entry) => entry.id !== item.id),
                      )
                    }
                    className="h-auto px-0 text-xs font-semibold text-[#b0453a]"
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6">
      <span className="text-bloom-subtle">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function AddTimeOffDialog({ onAdd }: { onAdd: (item: StaffTimeOff) => void }) {
  const [open, setOpen] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onAdd({
      id: `time-off-${Date.now()}`,
      date: String(data.get("date")),
      reason: String(data.get("reason")),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-bloom-border bg-white text-[13px] font-semibold shadow-none"
        >
          <Plus /> Add time off
        </Button>
      </DialogTrigger>
      <DialogContent className="border-bloom-border bg-white sm:max-w-[420px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Add time off</DialogTitle>
            <DialogDescription>
              Block a day from this staff member&apos;s availability.
            </DialogDescription>
          </DialogHeader>
          <div className="my-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="time-off-date">Date</Label>
              <Input
                id="time-off-date"
                name="date"
                type="date"
                required
                className="border-bloom-border shadow-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time-off-reason">Reason</Label>
              <Input
                id="time-off-reason"
                name="reason"
                required
                placeholder="e.g. Personal day"
                className="border-bloom-border shadow-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-bloom-text text-bloom-bg">
              Add time off
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
