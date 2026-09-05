export const SKU_LABELS: Record<string, string> = {
  DEN: "Đèn",
  DO_CHOI: "Đồ chơi",
  MOC_KHOA: "Móc khoá",
  KHAC: "Khác",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  IN_PRODUCTION: "Đang in",
  SHIPPED: "Đã gửi",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
};

export const ORDER_STATUS_BADGE_CLASS: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  IN_PRODUCTION: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  SHIPPED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  COMPLETED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  NGUYEN_LIEU: "Nguyên liệu (nhựa)",
  BAO_BI_VAN_CHUYEN: "Chi phí khác",
  SAN_XUAT_CHUNG: "Sản xuất chung (điện, khấu hao)",
  TAI_SAN_CO_DINH: "Tài sản cố định",
};
