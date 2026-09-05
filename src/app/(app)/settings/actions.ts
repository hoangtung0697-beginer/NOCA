"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parsePrinterFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const machineWattage = Number(formData.get("machineWattage"));
  const electricityPricePerKwh = Number(formData.get("electricityPricePerKwh"));
  const machinePrice = Number(formData.get("machinePrice"));
  const machineLifetimeHours = Number(formData.get("machineLifetimeHours"));

  if (!name) throw new Error("Thiếu tên loại máy in");

  const values = { machineWattage, electricityPricePerKwh, machinePrice, machineLifetimeHours };
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Giá trị "${key}" không hợp lệ`);
    }
  }

  return { name, ...values };
}

export async function createPrinter(formData: FormData) {
  const data = parsePrinterFormData(formData);
  await prisma.printer.create({ data });
  revalidatePath("/settings");
  revalidatePath("/pricing");
}

export async function updatePrinter(id: string, formData: FormData) {
  const data = parsePrinterFormData(formData);
  await prisma.printer.update({ where: { id }, data });
  revalidatePath("/settings");
  revalidatePath("/pricing");
  revalidatePath("/orders");
}

export async function deletePrinter(id: string) {
  try {
    await prisma.printer.delete({ where: { id } });
  } catch {
    throw new Error("Không thể xoá — loại máy in này đang được dùng bởi sản phẩm trong danh mục");
  }
  revalidatePath("/settings");
}

function parseSalespersonFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Thiếu tên người bán hàng");
  return { name };
}

export async function createSalesperson(formData: FormData) {
  const data = parseSalespersonFormData(formData);
  await prisma.salesperson.create({ data });
  revalidatePath("/settings");
  revalidatePath("/orders");
  revalidatePath("/commission");
}

export async function updateSalesperson(id: string, formData: FormData) {
  const data = parseSalespersonFormData(formData);
  await prisma.salesperson.update({ where: { id }, data });
  revalidatePath("/settings");
  revalidatePath("/orders");
  revalidatePath("/commission");
}

export async function deleteSalesperson(id: string) {
  await prisma.salesperson.delete({ where: { id } });
  revalidatePath("/settings");
  revalidatePath("/orders");
  revalidatePath("/commission");
}

function parseExpenseSourceFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Thiếu tên nguồn chi");
  return { name };
}

export async function createExpenseSource(formData: FormData) {
  const data = parseExpenseSourceFormData(formData);
  await prisma.expenseSource.create({ data });
  revalidatePath("/settings");
  revalidatePath("/expenses");
}

export async function updateExpenseSource(id: string, formData: FormData) {
  const data = parseExpenseSourceFormData(formData);
  await prisma.expenseSource.update({ where: { id }, data });
  revalidatePath("/settings");
  revalidatePath("/expenses");
}

export async function deleteExpenseSource(id: string) {
  await prisma.expenseSource.delete({ where: { id } });
  revalidatePath("/settings");
  revalidatePath("/expenses");
}

function parsePartnerFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Thiếu tên đối tác");
  return { name };
}

export async function createPartner(formData: FormData) {
  const data = parsePartnerFormData(formData);
  await prisma.partner.create({ data });
  revalidatePath("/settings");
  revalidatePath("/profit-split");
}

export async function updatePartner(id: string, formData: FormData) {
  const data = parsePartnerFormData(formData);
  await prisma.partner.update({ where: { id }, data });
  revalidatePath("/settings");
  revalidatePath("/profit-split");
}

export async function deletePartner(id: string) {
  await prisma.partner.delete({ where: { id } });
  revalidatePath("/settings");
  revalidatePath("/profit-split");
}
