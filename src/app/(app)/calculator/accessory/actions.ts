"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseAccessoryFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const note = String(formData.get("note") ?? "").trim();

  if (!name) throw new Error("Thiếu tên phụ kiện");
  if (!Number.isFinite(price) || price < 0) throw new Error("Giá không hợp lệ");

  return { name, price, note: note || null };
}

export async function createAccessory(formData: FormData) {
  const data = parseAccessoryFormData(formData);
  await prisma.accessory.create({ data });
  revalidatePath("/calculator");
}

export async function updateAccessory(id: string, formData: FormData) {
  const data = parseAccessoryFormData(formData);
  await prisma.accessory.update({ where: { id }, data });
  revalidatePath("/calculator");
}

export async function deleteAccessory(id: string) {
  await prisma.accessory.delete({ where: { id } });
  revalidatePath("/calculator");
}
