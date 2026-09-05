"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ExpenseCategory } from "@/generated/prisma/enums";

function parseExpenseFormData(formData: FormData) {
  const category = String(formData.get("category") ?? "") as ExpenseCategory;
  const amount = Number(formData.get("amount"));
  const date = String(formData.get("date") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const expenseSourceId = String(formData.get("expenseSourceId") ?? "").trim();

  if (!Object.values(ExpenseCategory).includes(category)) {
    throw new Error("Danh mục không hợp lệ");
  }
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Số tiền không hợp lệ");
  if (!date) throw new Error("Thiếu ngày chi");
  if (category === "TAI_SAN_CO_DINH" && !note) {
    throw new Error("Nhập tên tài sản vào ô Tên tài sản");
  }

  return {
    category,
    amount,
    date: new Date(date),
    note: note || null,
    expenseSourceId: expenseSourceId || null,
  };
}

export async function createExpense(formData: FormData) {
  const data = parseExpenseFormData(formData);
  await prisma.expense.create({ data });
  if (data.category === "TAI_SAN_CO_DINH") {
    await prisma.fixedAsset.create({
      data: { name: data.note ?? "Tài sản cố định", price: data.amount, purchaseDate: data.date },
    });
  }
  revalidatePath("/expenses");
  revalidatePath("/");
}

export async function updateExpense(id: string, formData: FormData) {
  const data = parseExpenseFormData(formData);
  await prisma.expense.update({ where: { id }, data });
  revalidatePath("/expenses");
  revalidatePath("/");
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/expenses");
  revalidatePath("/");
}
