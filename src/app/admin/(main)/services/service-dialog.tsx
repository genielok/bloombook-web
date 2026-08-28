"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

import {
  createService,
  editService,
  EditServiceFormValues,
  type ServiceFormValues,
} from "@/app/api/admins/admin";
import Toast from "@/components/Toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage, sleep } from "@/lib/func";
import { AdminFormField } from "../components/admin-form";
import {
  type AdminService,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABELS,
  ServiceCategory,
} from "../components/services-data";

const EMPTY_SERVICE: ServiceFormValues = {
  name: "",
  category: ServiceCategory.Hair,
  durationMinutes: 45,
  price: 0,
  description: "",
  active: true,
};

function getServiceValues(service: AdminService | null): ServiceFormValues {
  return service
    ? {
        name: service.name,
        category: service.serviceCategory,
        durationMinutes: service.durationMinutes,
        price: service.price,
        description: service.description,
        active: service.active,
      }
    : EMPTY_SERVICE;
}

type ServiceDialogProps = {
  open: boolean;
  editingService: AdminService | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void> | void;
};

export function ServiceDialog({
  open,
  editingService,
  onOpenChange,
  onSaved,
}: ServiceDialogProps) {
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const formValues = useMemo(
    () => getServiceValues(editingService),
    [editingService],
  );
  const isEdit = useMemo(() => !!editingService, [editingService]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    defaultValues: EMPTY_SERVICE,
    values: formValues,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setSubmitError("");
    onOpenChange(nextOpen);
  };

  const submitService: SubmitHandler<
    ServiceFormValues | EditServiceFormValues
  > = async (data) => {
    try {
      // The backend currently exposes create only. Replace this with the
      // update endpoint when it becomes available.
      if (isEdit && editingService) {
        await editService({ ...data, id: editingService.id });
      } else {
        await createService(data);
      }
      await onSaved();
      setShowSuccess(true);
      sleep(1000);
      handleOpenChange(false);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto border-bloom-border bg-white sm:max-w-[720px]">
          <form
            onSubmit={handleSubmit(submitService)}
            className="flex flex-col gap-5"
          >
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit service" : "Add service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update this service's booking details."
                  : "Create a service customers can book."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <AdminFormField
                label="Service name"
                htmlFor="service-name"
                required
              >
                <Input
                  id="service-name"
                  {...register("name", {
                    required: "Service name is required",
                    minLength: {
                      value: 2,
                      message: "Service name must be at least 2 characters",
                    },
                  })}
                  aria-invalid={Boolean(errors.name)}
                  placeholder="e.g. Gel Manicure"
                  className="h-10 border-bloom-border bg-white px-3 text-sm shadow-none"
                />
                {errors.name && (
                  <p role="alert" className="text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </AdminFormField>

              <div className="grid gap-3 sm:grid-cols-3">
                <AdminFormField
                  label="Category"
                  required
                  htmlFor="category-select"
                >
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as ServiceCategory)
                        }
                      >
                        <SelectTrigger
                          id="category-select"
                          aria-invalid={Boolean(errors.category)}
                          className="h-10 w-full border-bloom-border bg-white text-sm shadow-none"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_CATEGORIES.map((item) => (
                            <SelectItem key={item} value={item}>
                              {SERVICE_CATEGORY_LABELS[item]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </AdminFormField>

                <AdminFormField
                  label="Duration (minutes)"
                  htmlFor="durationMinutes"
                  required
                >
                  <Input
                    id="durationMinutes"
                    type="number"
                    min={5}
                    step={5}
                    {...register("durationMinutes", {
                      required: "Duration is required",
                      valueAsNumber: true,
                      min: {
                        value: 5,
                        message: "Duration must be at least 5 minutes",
                      },
                      validate: (value) =>
                        value % 5 === 0 ||
                        "Duration must use 5-minute intervals",
                    })}
                    aria-invalid={Boolean(errors.durationMinutes)}
                    className="h-10 border-bloom-border bg-white px-3 text-sm shadow-none"
                  />
                  {errors.durationMinutes && (
                    <p role="alert" className="text-sm text-red-500">
                      {errors.durationMinutes.message}
                    </p>
                  )}
                </AdminFormField>

                <AdminFormField label="Price (€)" htmlFor="price" required>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Price cannot be negative",
                      },
                    })}
                    aria-invalid={Boolean(errors.price)}
                    className="h-10 border-bloom-border bg-white px-3 text-sm shadow-none"
                  />
                  {errors.price && (
                    <p role="alert" className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </AdminFormField>
              </div>

              <AdminFormField label="Description" htmlFor="description">
                <Textarea
                  id="description"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                  aria-invalid={Boolean(errors.description)}
                  placeholder="Describe what is included in this service…"
                  className="min-h-20 resize-y border-bloom-border bg-white px-3 py-2.5 text-sm shadow-none"
                />
                {errors.description && (
                  <p role="alert" className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </AdminFormField>

              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2.5">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Active — bookable by customers"
                    />
                    <span className="text-[13px] font-semibold text-bloom-text">
                      Active — bookable by customers
                    </span>
                  </div>
                )}
              />

              {submitError && (
                <p role="alert" className="text-sm text-red-500">
                  {submitError}
                </p>
              )}
            </div>

            <DialogFooter className="mx-0 mb-0 px-0 pb-0">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-bloom-text text-bloom-bg hover:bg-bloom-text/90"
              >
                {isSubmitting && <Spinner data-icon="inline-start" />}
                {isSubmitting ? "Saving..." : "Save service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toast
        visible={showSuccess}
        type="success"
        message={editingService ? "Service updated" : "Service added"}
        duration={2000}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
