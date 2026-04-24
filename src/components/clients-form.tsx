import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

const lineItemSchema = z.object({
  description: z.string().trim().min(2, "Mínimo 2 caracteres").max(120),
  quantity: z.coerce.number().min(1, "Mínimo 1").max(9999),
  unitPrice: z.coerce.number().min(0.01, "Debe ser > 0").max(1000000),
});

const paymentSchema = z.object({
  clientName: z.string().trim().min(2, "Nombre requerido").max(80),
  email: z.string().trim().email("Email inválido").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{7,20}$/, "Teléfono inválido"),
  documentType: z.enum(["dni", "ruc", "passport"], {
    required_error: "Selecciona un tipo",
  }),
  documentNumber: z.string().trim().min(5, "Mínimo 5").max(20),
  paymentMethod: z.enum(["cash", "card", "transfer", "wallet"]),
  currency: z.enum(["USD", "EUR", "PEN", "MXN"]),
  dueDate: z.string().min(1, "Fecha requerida"),
  notes: z.string().max(500).optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos" }),
  }),
  items: z.array(lineItemSchema).min(1, "Agrega al menos 1 ítem"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

type PaymentRecord = PaymentFormValues & {
  id: string;
  total: number;
  status: "pendiente" | "pagado" | "vencido";
  createdAt: string;
};

const seedRecords: PaymentRecord[] = [
  {
    id: "P-0001",
    clientName: "Acme Corp",
    email: "billing@acme.com",
    phone: "+1 555 1234",
    documentType: "ruc",
    documentNumber: "20123456789",
    paymentMethod: "transfer",
    currency: "USD",
    dueDate: "2025-12-15",
    notes: "",
    acceptTerms: true,
    items: [{ description: "Consultoría", quantity: 10, unitPrice: 120 }],
    total: 1200,
    status: "pagado",
    createdAt: "2025-11-02",
  },
  {
    id: "P-0002",
    clientName: "Globex SA",
    email: "ap@globex.com",
    phone: "+34 600 222 333",
    documentType: "ruc",
    documentNumber: "B12345678",
    paymentMethod: "card",
    currency: "EUR",
    dueDate: "2025-12-20",
    notes: "Renovación anual",
    acceptTerms: true,
    items: [{ description: "Suscripción Pro", quantity: 1, unitPrice: 480 }],
    total: 480,
    status: "pendiente",
    createdAt: "2025-11-10",
  },
];

export function ClientsForm() {
  const [records, setRecords] = useState<PaymentRecord[]>(seedRecords);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
      documentType: undefined,
      documentNumber: "",
      paymentMethod: "transfer",
      currency: "USD",
      dueDate: "",
      notes: "",
      acceptTerms: false as unknown as true,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
  const currency = watch("currency");

  const total = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0,
  );

  const onSubmit = (data: PaymentFormValues) => {
    const record: PaymentRecord = {
      ...data,
      id: `P-${String(records.length + 1).padStart(4, "0")}`,
      total: data.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
      status: "pendiente",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRecords((r) => [record, ...r]);
    toast.success(`Pago registrado: ${record.id}`);
    reset();
  };

  const statusBody = (row: PaymentRecord) => {
    const sev =
      row.status === "pagado" ? "success" : row.status === "vencido" ? "danger" : "warning";
    return <Tag value={row.status} severity={sev} />;
  };

  const totalBody = (row: PaymentRecord) =>
    `${row.currency} ${row.total.toFixed(2)}`;

  const itemsBody = (row: PaymentRecord) => row.items.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Registrar pago</CardTitle>
          <CardDescription>
            Formulario validado con Zod + React Hook Form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre del cliente</Label>
                <Input {...register("clientName")} placeholder="Acme Corp" />
                {errors.clientName && (
                  <p className="text-xs text-destructive">{errors.clientName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register("email")} placeholder="cliente@dominio.com" />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input {...register("phone")} placeholder="+1 555 1234" />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Tipo doc.</Label>
                  <Controller
                    control={control}
                    name="documentType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dni">DNI</SelectItem>
                          <SelectItem value="ruc">RUC / Tax ID</SelectItem>
                          <SelectItem value="passport">Pasaporte</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.documentType && (
                    <p className="text-xs text-destructive">{errors.documentType.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Número doc.</Label>
                  <Input {...register("documentNumber")} />
                  {errors.documentNumber && (
                    <p className="text-xs text-destructive">{errors.documentNumber.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="PEN">PEN</SelectItem>
                          <SelectItem value="MXN">MXN</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vencimiento</Label>
                  <Input type="date" {...register("dueDate")} />
                  {errors.dueDate && (
                    <p className="text-xs text-destructive">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea rows={3} {...register("notes")} placeholder="Opcional" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Ítems</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Agregar
                </Button>
              </div>
              <div className="space-y-2">
                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    className="grid grid-cols-12 gap-2 items-start animate-fade-in"
                  >
                    <div className="col-span-6">
                      <Input
                        placeholder="Descripción"
                        {...register(`items.${idx}.description`)}
                      />
                      {errors.items?.[idx]?.description && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.items[idx]?.description?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Cant."
                        {...register(`items.${idx}.quantity`)}
                      />
                      {errors.items?.[idx]?.quantity && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.items[idx]?.quantity?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        {...register(`items.${idx}.unitPrice`)}
                      />
                      {errors.items?.[idx]?.unitPrice && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.items[idx]?.unitPrice?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fields.length > 1 && remove(idx)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {errors.items && typeof errors.items.message === "string" && (
                <p className="text-xs text-destructive">{errors.items.message}</p>
              )}
              <div className="flex justify-end pt-2 text-lg font-semibold">
                Total: {currency} {total.toFixed(2)}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                  />
                )}
              />
              <div>
                <Label className="text-sm">Acepto los términos y condiciones</Label>
                {errors.acceptTerms && (
                  <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Limpiar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-1" /> Guardar pago
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagos registrados</CardTitle>
          <CardDescription>Tabla con PrimeReact (paginación, orden y filtro).</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            value={records}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            sortMode="multiple"
            removableSort
            filterDisplay="row"
            stripedRows
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="id" header="ID" sortable filter filterPlaceholder="Buscar" />
            <Column field="clientName" header="Cliente" sortable filter filterPlaceholder="Cliente" />
            <Column field="email" header="Email" sortable />
            <Column field="paymentMethod" header="Método" sortable />
            <Column header="Ítems" body={itemsBody} />
            <Column header="Total" body={totalBody} sortable sortField="total" />
            <Column field="dueDate" header="Vence" sortable />
            <Column header="Estado" body={statusBody} sortable sortField="status" />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
