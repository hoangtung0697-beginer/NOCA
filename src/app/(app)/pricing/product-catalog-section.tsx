"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatVnd } from "@/lib/format";
import { SKU_LABELS } from "@/lib/constants";
import { PricingCalculator, type EditableProduct, type PrinterOption } from "./pricing-calculator";
import { ProductDeleteButton } from "./product-delete-button";

interface ProductListItem extends EditableProduct {
  printerName: string;
  computedCost: number;
  computedPrice: number;
}

interface ProductCatalogSectionProps {
  printers: PrinterOption[];
  products: ProductListItem[];
}

export function ProductCatalogSection({ printers, products }: ProductCatalogSectionProps) {
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(null);

  return (
    <div className="space-y-8">
      <PricingCalculator
        printers={printers}
        editingProduct={editingProduct}
        onDoneEditing={() => setEditingProduct(null)}
      />

      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">Danh mục sản phẩm</h2>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Loại máy in</TableHead>
                <TableHead className="text-right">Chi phí</TableHead>
                <TableHead className="text-right">Giá đề xuất</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Chưa có sản phẩm nào trong danh mục.
                  </TableCell>
                </TableRow>
              )}
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{SKU_LABELS[product.sku]}</TableCell>
                  <TableCell className="text-muted-foreground">{product.printerName}</TableCell>
                  <TableCell className="text-right">{formatVnd(product.computedCost)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatVnd(product.computedPrice)}
                  </TableCell>
                  <TableCell className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                      Sửa
                    </Button>
                    <ProductDeleteButton id={product.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
