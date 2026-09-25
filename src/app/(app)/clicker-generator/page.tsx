export default function ClickerGeneratorPage() {
  return (
    <div className="flex h-[calc(100svh-2.5rem)] flex-col gap-3 md:h-[calc(100svh-3rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clicker Generator</h1>
        <p className="text-sm text-muted-foreground">
          Tạo model 3D (3MF) từ ảnh cho clicker gắn switch Cherry MX — công cụ nội bộ, chạy hoàn
          toàn trên trình duyệt.
        </p>
      </div>

      <iframe
        src="/clicker-generator/index.html"
        title="Clicker Generator"
        className="min-h-0 w-full flex-1 rounded-2xl border"
        allow="clipboard-write"
      />
    </div>
  );
}
