import { prisma } from "@/lib/prisma";
import { calculatePricing } from "@/lib/pricing";
import { CalculatorShell } from "./calculator-shell";

export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const [materials, printers, accessories, products] = await Promise.all([
    prisma.material.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.printer.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.accessory.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { printer: true } }),
  ]);

  const materialOptions = materials.map((m) => ({
    id: m.id,
    name: m.name,
    type: m.type,
    pricePerKg: Number(m.pricePerKg),
    remainingGram: Number(m.remainingGram),
    note: m.note,
  }));

  const printerOptions = printers.map((p) => ({
    id: p.id,
    name: p.name,
    machineWattage: Number(p.machineWattage),
    electricityPricePerKwh: Number(p.electricityPricePerKwh),
    machinePrice: Number(p.machinePrice),
    machineLifetimeHours: Number(p.machineLifetimeHours),
  }));

  const accessoryOptions = accessories.map((a) => ({
    id: a.id,
    name: a.name,
    price: Number(a.price),
    note: a.note,
  }));

  const productRows = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    printerName: p.printer.name,
    computedPrice: calculatePricing({
      filamentWeightGram: Number(p.filamentWeightGram),
      filamentPricePerKg: Number(p.filamentPricePerKg),
      printHours: Number(p.printHours),
      machineWattage: Number(p.printer.machineWattage),
      electricityPricePerKwh: Number(p.printer.electricityPricePerKwh),
      machinePrice: Number(p.printer.machinePrice),
      machineLifetimeHours: Number(p.printer.machineLifetimeHours),
      otherCost: Number(p.otherCost),
      commissionCost: Number(p.commissionCost),
      marginPercent: Number(p.marginPercent),
    }).suggestedPrice,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Máy tính giá</h1>
        <p className="text-sm text-muted-foreground">
          Công cụ báo giá nhanh — chọn nhựa, máy in, phụ kiện để ra giá ngay. Máy in và Sản phẩm
          dùng chung dữ liệu với trang quản lý.
        </p>
      </div>

      <CalculatorShell
        materials={materialOptions}
        printers={printerOptions}
        accessories={accessoryOptions}
        products={productRows}
      />
    </div>
  );
}
