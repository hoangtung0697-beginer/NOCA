import { prisma } from "@/lib/prisma";
import { calculatePricing } from "@/lib/pricing";
import { ProductCatalogSection } from "./product-catalog-section";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const [printers, products] = await Promise.all([
    prisma.printer.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { printer: true } }),
  ]);

  const printerOptions = printers.map((p) => ({
    id: p.id,
    name: p.name,
    machineWattage: Number(p.machineWattage),
    electricityPricePerKwh: Number(p.electricityPricePerKwh),
    machinePrice: Number(p.machinePrice),
    machineLifetimeHours: Number(p.machineLifetimeHours),
  }));

  const productListItems = products.map((p) => {
    const breakdown = calculatePricing({
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
    });

    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      printerId: p.printerId,
      printerName: p.printer.name,
      filamentWeightGram: Number(p.filamentWeightGram),
      filamentPricePerKg: Number(p.filamentPricePerKg),
      printHours: Number(p.printHours),
      otherCost: Number(p.otherCost),
      otherCostNote: p.otherCostNote,
      commissionCost: Number(p.commissionCost),
      marginPercent: Number(p.marginPercent),
      computedCost: breakdown.totalCost,
      computedPrice: breakdown.suggestedPrice,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tính giá & Danh mục sản phẩm</h1>
        <p className="text-sm text-muted-foreground">
          Tính chi phí nguyên liệu, sản xuất chung (điện, khấu hao) và chi phí khác để ra giá bán
          đề xuất. Chọn loại máy in đã cấu hình ở trang Cài đặt để tự điền công suất, giá điện, giá
          máy, tuổi thọ.
        </p>
      </div>

      <ProductCatalogSection printers={printerOptions} products={productListItems} />
    </div>
  );
}
