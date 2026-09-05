"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
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
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SKU_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { createOrder, updateOrder } from "./actions";

const CUSTOM_PRODUCT = "CUSTOM";

interface ProductOption {
  id: string;
  name: string;
  sku: string;
  computedPrice: number;
}

interface SalespersonOption {
  id: string;
  name: string;
}

interface OrderDialogProps {
  mode: "create" | "edit";
  products: ProductOption[];
  salespeople: SalespersonOption[];
  order?: {
    id: string;
    customerName: string;
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    orderDate: string;
    status: string;
    note: string | null;
    productId: string | null;
    salespersonId: string | null;
    unitCommissionCost: number | null;
    depositAmount: number;
  };
  trigger: React.ReactElement;
}

const NO_SALESPERSON = "NONE";
const COMMISSION_RATE = 0.2;

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function OrderDialog({ mode, products, salespeople, order, trigger }: OrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const initialProductId =
    order?.productId && products.some((p) => p.id === order.productId)
      ? order.productId
      : CUSTOM_PRODUCT;
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const initialSalespersonId =
    order?.salespersonId && salespeople.some((s) => s.id === order.salespersonId)
      ? order.salespersonId
      : NO_SALESPERSON;
  const [selectedSalespersonId, setSelectedSalespersonId] = useState(initialSalespersonId);
  const [unitPrice, setUnitPriceRaw] = useState(order?.unitPrice ?? 0);
  const [commissionCost, setCommissionCost] = useState(
    order?.unitCommissionCost ?? Math.round((order?.unitPrice ?? 0) * COMMISSION_RATE),
  );
  const [depositAmount, setDepositAmount] = useState(order?.depositAmount ?? 0);

  function setUnitPrice(price: number) {
    setUnitPriceRaw(price);
    setCommissionCost(Math.round(price * COMMISSION_RATE));
  }

  const productItems = useMemo(() => {
    const items: Record<string, string> = { [CUSTOM_PRODUCT]: "— Nhập tay (ngoài danh mục) —" };
    for (const p of products) items[p.id] = `${p.name} (${SKU_LABELS[p.sku]})`;
    return items;
  }, [products]);

  const salespersonItems = useMemo(() => {
    const items: Record<string, string> = { [NO_SALESPERSON]: "— Không chọn —" };
    for (const s of salespeople) items[s.id] = s.name;
    return items;
  }, [salespeople]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const skipNextAutoFill = useRef(true);
  useEffect(() => {
    if (skipNextAutoFill.current) {
      skipNextAutoFill.current = false;
      return;
    }
    if (selectedProduct) {
      setUnitPrice(selectedProduct.computedPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId]);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createOrder(formData);
          toast.success("Đã tạo đơn hàng");
        } else if (order) {
          await updateOrder(order.id, formData);
          toast.success("Đã cập nhật đơn hàng");
        }
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Tạo đơn hàng" : "Sửa đơn hàng"}</DialogTitle>
          <DialogDescription>
            Chọn sản phẩm từ danh mục để tự điền giá, hoặc nhập tay cho đơn đặc biệt.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="productId" value={selectedProductId === CUSTOM_PRODUCT ? "" : selectedProductId} />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="customerName">Khách hàng</Label>
              <Input
                id="customerName"
                name="customerName"
                required
                defaultValue={order?.customerName}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="product">Sản phẩm</Label>
              <Select
                items={productItems}
                value={selectedProductId}
                onValueChange={(v) => v && setSelectedProductId(v)}
              >
                <SelectTrigger id="product" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(productItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProductId === CUSTOM_PRODUCT ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Select name="sku" items={SKU_LABELS} defaultValue={order?.sku ?? "DEN"}>
                    <SelectTrigger id="sku" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SKU_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productName">Tên sản phẩm</Label>
                  <Input
                    id="productName"
                    name="productName"
                    required
                    defaultValue={order?.productName}
                  />
                </div>
              </>
            ) : (
              <div className="col-span-2 text-sm text-muted-foreground">
                SKU: {selectedProduct ? SKU_LABELS[selectedProduct.sku] : ""} — giá đề xuất tự
                điền, có thể sửa lại đơn giá bên dưới nếu cần.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                name="status"
                items={ORDER_STATUS_LABELS}
                defaultValue={order?.status ?? "PENDING"}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesperson">Người bán hàng</Label>
              <input
                type="hidden"
                name="salespersonId"
                value={selectedSalespersonId === NO_SALESPERSON ? "" : selectedSalespersonId}
              />
              <Select
                items={salespersonItems}
                value={selectedSalespersonId}
                onValueChange={(v) => v && setSelectedSalespersonId(v)}
              >
                <SelectTrigger id="salesperson" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(salespersonItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                step={1}
                required
                defaultValue={order?.quantity ?? 1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Đơn giá (VNĐ)</Label>
              <NumberInput id="unitPrice" name="unitPrice" value={unitPrice} onValueChange={setUnitPrice} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionCost">Chi phí hoa hồng (VNĐ)</Label>
              <NumberInput
                id="commissionCost"
                name="commissionCost"
                value={commissionCost}
                onValueChange={setCommissionCost}
              />
              <p className="text-xs text-muted-foreground">Tự động 20% đơn giá, có thể sửa lại.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Tiền cọc (VNĐ)</Label>
              <NumberInput
                id="depositAmount"
                name="depositAmount"
                value={depositAmount}
                onValueChange={setDepositAmount}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDate">Ngày đặt</Label>
              <Input
                id="orderDate"
                name="orderDate"
                type="date"
                required
                defaultValue={toDateInputValue(order?.orderDate)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" name="note" defaultValue={order?.note ?? ""} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
