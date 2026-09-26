// Minimal i18n: English is always the fallback (written inline at each call
// site), Vietnamese strings live in the dictionary below. Missing/未-added
// keys just fall back to English instead of showing a raw key.
export type Lang = 'en' | 'vi';

const STORAGE_KEY = 'clicker_lang';

export function getLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'vi' || v === 'en') return v;
  } catch {
    /* ignore (private mode, etc.) */
  }
  return 'en';
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

const VI: Record<string, string> = {
  // --- App header ---
  'app.subtitle': 'Tạo model 3D in được từ một hình ảnh',

  // --- Preview & View ---
  'preview.label': 'Xem trước',
  'preview.assembled': 'Lắp ráp',
  'preview.exploded': 'Tách rời',
  'preview.showSwitch': 'Hiện switch MX',
  'preview.showSwitchTip':
    'Hiện một switch MX tham chiếu trong bản xem trước để kiểm tra độ vừa vặn. Không nằm trong model xuất ra.',

  // --- Base style ---
  'baseStyle.label': 'Kiểu dáng cơ bản',
  'baseStyle.tip':
    'Outline (Viền) đi theo đúng đường viền của ảnh. Shape (Hình khối) đặt ảnh lên một nền có sẵn như hình tròn, vuông.',
  'baseStyle.outline': 'Viền ảnh',
  'baseStyle.shape': 'Hình khối',
  'shapeGeom.label': 'Hình dạng nền',
  'shapeGeom.tip': 'Hình khối nền dựng sẵn được dùng khi chọn kiểu Hình khối.',
  'shape.circle': 'Tròn',
  'shape.square': 'Vuông',
  'shape.hexagon': 'Lục giác',
  'shape.heart': 'Trái tim',
  'shape.star': 'Ngôi sao',
  'shape.egg': 'Hình trứng',

  'size.label': 'Kích thước',
  'size.tip':
    'Kích thước tổng thể của clicker (cạnh dài nhất, tính bằng mm). Việc này scale toàn bộ model theo tỉ lệ, không chỉ riêng chiều rộng.',

  // --- Section headings ---
  'section.colors': '1 · Màu sắc & Làm mượt',
  'section.moreSettings': '2 · Cài đặt thêm',
  'section.switch': '3 · Switch',

  'colors.label': 'Số màu',
  'colors.tip':
    'Ảnh được chia thành bao nhiêu màu nhựa (filament) riêng biệt. Mỗi màu sẽ là một phần riêng khi xuất file.',
  'colors.unit': 'Màu',
  'colors.limited': 'Giới hạn',

  'smoothing.label': 'Làm mượt',
  'smoothing.tip':
    'Đơn giản hóa và làm mượt đường viền đã trace. Giá trị cao cho đường viền gọn, ít chi tiết; giá trị thấp giữ nhiều chi tiết nhỏ hơn.',

  'palette.hint': 'Tải ảnh/vector lên để chọn màu.',
  'palette.recolorTip': 'Mẹo: bấm vào bất kỳ màu nào trên model 3D để đổi màu.',
  'swatch.defaultBodyColor': 'màu thân mặc định',
  'swatch.clickerBodyColor': 'màu thân clicker',
  'swatch.detectedColor': 'màu phát hiện được',
  'swatch.filament': 'filament',
  'swatch.customColor': 'Màu tùy chỉnh',
  'filament.customColor': 'Màu tùy chỉnh',

  'keychain.label': 'Móc khóa',
  'keychain.tip': 'Thêm một móc để có thể gắn clicker vào chùm chìa khóa.',
  'keychain.position': 'Vị trí',
  'keychain.positionTip': 'Trượt móc khóa quanh mép của thân clicker.',
  'keychain.slideOffset': 'Độ lệch trượt',
  'keychain.slideOffsetTip': 'Trượt móc khóa dọc theo tiếp tuyến mép thân (tinh chỉnh).',
  'keychain.holeSize': 'Kích thước lỗ',
  'keychain.holeSizeTip': 'Đường kính lỗ vòng — chỉnh vừa với vòng chìa khóa, dây hoặc móc carabiner.',

  'edges.heading': 'Cạnh viền',
  'edges.tip':
    'Bo tròn (fillet) hoặc vát (chamfer) các cạnh ngoài. "Cap top" tạo hình viền trên của nắp. "Clicker base" tạo hình cạnh trên và dưới của thân cùng lúc.',
  'edges.capTop': 'Đỉnh nắp',
  'edges.clickerBase': 'Thân clicker',
  'edges.none': 'Không',
  'edges.fillet': 'Bo tròn',
  'edges.chamfer': 'Vát cạnh',

  'topThickness.label': 'Độ dày mặt trên',
  'topThickness.tip': 'Độ dày của lớp mặt trên đặc bên dưới hình ảnh màu, tính bằng mm.',
  'imageDepth.label': 'Độ sâu hình ảnh',
  'imageDepth.tip': 'Hình ảnh màu được nâng lên bao sâu vào bề mặt trên, tính bằng mm.',

  'socketTol.label': 'Dung sai ổ cắm switch',
  'socketTol.tip':
    'Khe hở giữa phần trên và phần đế mà nó lắp vào. Bấm + nếu hai nửa khó lắp vào nhau, − nếu bị lỏng. 0 = độ vừa mặc định.',
  'stemTol.label': 'Dung sai chân cắm (phần trên)',
  'stemTol.tip':
    'Scale phần chân cắm dưới phần trên, nơi ôm lấy switch MX. Nếu chân cắm quá chật khó ấn vào switch, bấm + để nới lỏng; bấm − để chặt hơn. Mỗi lần chỉnh 0.2 mm.',

  'switches.label': 'Số switch',
  'switches.tip':
    'Dùng 1–3 switch MX cho thiết kế lớn hoặc rộng hơn — nhiều điểm bấm và ổn định hơn. Mỗi switch có thể di chuyển và xoay riêng.',
  'switches.moveRotateHint': 'Di chuyển & xoay switch MX',
  'switches.moveRotateTip':
    'Trượt và xoay switch MX đang chọn ra khỏi tâm thiết kế. Hữu ích khi switch không nằm gọn ở giữa thiết kế của bạn.',
  'switches.centered': 'Ở giữa',
  'switches.resetAll': 'Đặt lại tất cả switch',

  'importSource.label': 'Nguồn nhập',
  'importSource.image': 'Ảnh',
  'importSource.svg': 'SVG',
  'importSource.icon': 'Icon',
  'importSource.text': 'Chữ',

  'upload.title': 'Tải ảnh lên',
  'upload.dropText': 'Thả ảnh vào đây, hoặc ',
  'upload.clickBrowse': 'bấm để chọn file',
  'upload.pngHint': 'Ảnh PNG có nền trong suốt cho kết quả tốt nhất',

  'removeBg.label': 'Xóa nền',
  'removeBg.tipImage':
    'Tự động xóa nền đơn sắc hoặc gần như đồng màu khỏi ảnh tải lên để chỉ trace phần chủ thể.',
  'removeBg.tipSvg':
    'Bỏ đi hình chữ nhật đặc vẽ phía sau tác phẩm để chỉ giữ lại logo. Tắt để giữ nguyên nền của SVG.',

  'sample.heading': 'Chọn ảnh mẫu',

  'svgPanel.hint': 'Thả hoặc tải file SVG vector lên. Các path màu sẽ được gán vào các ô filament.',
  'svgPanel.uploadBtn': 'Tải file SVG lên',
  'svgPanel.emptyState': 'Chưa có SVG nào. Thả file vào đây hoặc dùng nút tải lên.',

  'generate': 'Tạo model',

  'iconPanel.searchPlaceholder': 'Tìm icon Lucide…',
  'iconPanel.clearSearch': 'Xóa tìm kiếm',
  'icons.noneMatch': 'Không có icon nào khớp.',
  'icons.match': 'kết quả',
  'icons.matches': 'kết quả',
  'icons.unit': 'icon',
  'icons.showing': 'đang hiện',

  'textPanel.customText': 'Nội dung chữ',
  'textPanel.defaultContent': 'Chữ\ntùy chỉnh',
  'textPanel.font': 'Font chữ',
  'textPanel.importFont': '+ Nhập font',

  'footer.download3mf': 'Tải file 3MF',
  'footer.saveProject': 'Lưu dự án',
  'footer.loadProject': 'Mở dự án',
  'footer.help': 'Trợ giúp',
  'footer.helpAria': 'Hiện phần giới thiệu và trợ giúp',
  'footer.themeToggleAria': 'Đổi giao diện sáng/tối',
  'footer.darkMode': 'Chế độ tối',
  'footer.lightMode': 'Chế độ sáng',
  'footer.langToggleAria': 'Đổi ngôn ngữ',

  'history.undoTitle': 'Hoàn tác (Ctrl+Z)',
  'history.undoAria': 'Hoàn tác',
  'history.redoTitle': 'Làm lại (Ctrl+Shift+Z)',
  'history.redoAria': 'Làm lại',
  'history.refreshTitle': 'Đặt lại về ban đầu',
  'history.refreshAria': 'Đặt lại',

  'loading.generating3d': 'Đang tạo model 3D…',

  'editMode.color': 'Màu sắc',
  'editMode.extrude': 'Đùn khối',
  'editMode.edges': 'Cạnh viền',
  'editMode.selectAPart': 'Chọn một phần',
  'editMode.level': 'Mức: {n}',
  'editMode.partsSelectedLevel': '{count} phần đã chọn · Mức: {n}',

  'letters.separate': 'Tách riêng từng chữ',

  'extrude.title': 'Đùn khối phần',
  'extrude.chamferEdges': 'Vát cạnh',
  'extrude.hint': 'Nâng lên hoặc hạ xuống màu đang chọn. Shift-click để chọn nhiều phần.',

  'edges.panelTitleEmpty': 'Chỉnh sửa cạnh',
  'edges.panelTitleSelected': 'Cạnh của phần đã chọn',
  'edges.hintPerPart':
    'Chọn một phần để bo tròn (fillet) hoặc vát (chamfer) cạnh trên của nó. Shift-click để chọn nhiều phần.',
  'edges.emptyState':
    'Bấm vào một phần trên model để bo tròn hoặc vát cạnh trên của nó.<br/>Cạnh của nắp &amp; đế nằm ở bảng bên trái, trong mục <strong>Kiểu dáng &amp; Kích thước</strong>.',

  'target.capTop': 'Đỉnh nắp',
  'target.baseTop': 'Đỉnh đế',
  'target.baseBottom': 'Đáy đế',
  'target.body': 'Thân',
  'target.capFrame': 'Khung nắp',
  'target.color': 'Màu',

  // --- Welcome modal ---
  'welcome.title': 'Chào mừng đến với Clicker Generator 👋',
  'welcome.body':
    'Biến bất kỳ ảnh, SVG, icon hay đoạn chữ nào thành một clicker 3D nhiều màu, sẵn sàng in bằng Bambu Studio hoặc PrusaSlicer.',
  'welcome.step1.title': 'Nhập thiết kế của bạn',
  'welcome.step1.text':
    'Thả một ảnh vào hoặc chọn ảnh mẫu, tải file SVG lên, chọn icon Lucide, hoặc gõ chữ tùy chỉnh.',
  'welcome.step2.title': 'Tùy chỉnh clicker',
  'welcome.step2.text': 'Chọn màu &amp; filament, chọn hình dạng, chỉnh kích thước và độ sâu.',
  'welcome.step3.title': 'Xuất file &amp; in',
  'welcome.step3.text':
    'Tải file 3MF về và mở trực tiếp trong phần mềm slicer. Mỗi màu là một phần riêng biệt.',
  'welcome.getStarted': 'Bắt đầu →',

  // --- What's new modal ---
  'update.badge': "Có gì mới",
  'update.title': 'Cập nhật mới nhất ✨',
  'update.intro': 'Một vài cải tiến kể từ lần bạn ghé thăm gần nhất:',
  'update.item1':
    '<strong>Trace ảnh sắc nét hơn</strong>: resampling chất lượng cao, khớp màu theo cảm quan, và làm mượt giữ chi tiết giúp giữ nguyên chữ nhỏ và chi tiết mảnh.',
  'update.item2':
    '<strong>Nhiều switch</strong>: dùng 1–3 switch MX cho thiết kế lớn hơn — mỗi switch di chuyển và xoay độc lập ở mục <em>Switch</em>.',
  'update.item3':
    '<strong>Móc khóa</strong>: thêm móc khóa, trượt quanh mép thân, chỉnh độ lệch trượt tiếp tuyến, hoặc đổi kích thước lỗ vòng.',
  'update.item4': '<strong>Sửa lỗi &amp; hoàn thiện</strong>: nhiều cải tiến nhỏ khác trong toàn bộ ứng dụng.',
  'update.dontShowAgain': 'Không hiện lại',
  'update.gotIt': 'Đã hiểu →',

  // --- Tutorial ---
  'tutorial.step1.title': 'Nguồn nhập',
  'tutorial.step1.text':
    'Chọn cách tạo model clicker 3D. Bạn có thể tải lên một <strong>Ảnh</strong> tùy chỉnh (PNG có nền trong suốt là tốt nhất), chọn từ <strong>hơn 1700 icon vector</strong>, nhập file <strong>SVG</strong> tùy chỉnh, hoặc nhập <strong>Chữ</strong> tùy ý.',
  'tutorial.step2.title': 'Xuất model 3MF',
  'tutorial.step2.text':
    'Khi đã ưng ý với thiết kế clicker, bấm vào đây để tải file <strong>3MF</strong> chất lượng cao, sẵn sàng in. 3MF là định dạng chuẩn hiện đại chứa dữ liệu nhiều màu, mở trực tiếp được trong phần mềm slicer yêu thích của bạn (như Bambu Studio, OrcaSlicer, hoặc PrusaSlicer).',
  'tutorial.step3.title': 'Cài đặt dự án',
  'tutorial.step3.text':
    'Lưu clicker đang làm dở thành file <code>.json</code> để chỉnh sửa tiếp sau, mở lại dự án cũ, chuyển giữa giao diện sáng/tối, hoặc mở hướng dẫn trợ giúp này.',
  'tutorial.step4.title': 'Khung xem 3D',
  'tutorial.step4.text':
    'Đây là nơi xem trước thiết kế của bạn ở dạng 3D. Mẹo: <strong>Chuột trái & kéo</strong> để xoay, <strong>Chuột phải & kéo</strong> để di chuyển, và <strong>Cuộn chuột</strong> để zoom.',
  'tutorial.step5.title': 'Chế độ Tô màu & Nâng khối',
  'tutorial.step5.text':
    'Chuyển giữa <strong>Chế độ Màu sắc</strong> (tô các phần bằng màu filament khác nhau) và <strong>Chế độ Đùn khối</strong> (nâng/hạ các phần của thiết kế, chỉnh độ dày, chiều cao và vát cạnh phần được nâng). Đang dùng <strong>Chữ</strong> tùy chỉnh? Bật <strong>Tách riêng từng chữ</strong> ở đây để tô màu hoặc đùn khối từng chữ riêng lẻ.',
  'tutorial.step6.title': 'Xem trước lắp ráp',
  'tutorial.step6.text':
    'Xem model ở trạng thái <strong>Lắp ráp</strong> hoặc <strong>Tách rời</strong> để thấy các phần in 3D khớp với nhau ra sao. Bạn cũng có thể hiện switch MX tham chiếu để kiểm tra độ vừa vặn.',
  'tutorial.step7.title': 'Hình dạng viền cơ bản',
  'tutorial.step7.text':
    'Chọn hình dạng nền tổng thể cho clicker. Bạn có thể chọn <strong>Viền ảnh tùy chỉnh</strong> (khớp theo đường viền ảnh đã nhập), hoặc các hình chuẩn như <strong>Hình tròn</strong> hay <strong>Lục giác</strong>. Bạn cũng có thể chỉnh kích thước tổng thể ở đây.',
  'tutorial.step8.title': 'Cài đặt hình dạng & kiểu dáng',
  'tutorial.step8.text':
    'Tinh chỉnh model trong các mục có thể thu gọn. <strong>1 · Màu sắc &amp; Làm mượt</strong> chọn màu filament và làm mượt đường viền. <strong>2 · Cài đặt thêm</strong> thêm móc khóa, đổi độ dày, và chỉnh <strong>dung sai ổ cắm &amp; chân cắm switch</strong> quyết định độ khít khi lắp phần trên và phần dưới vào nhau.',
  'tutorial.step9.title': 'Định vị Switch',
  'tutorial.step9.text':
    'Mở mục <strong>3 · Switch</strong> để <strong>di chuyển và xoay</strong> switch MX. Hữu ích khi switch không nằm gọn ở giữa thiết kế của bạn.',
  'tutorial.step10.title': 'Hoàn tác, Làm lại & Đặt lại',
  'tutorial.step10.text':
    'Dùng các nút này để hoàn tác/làm lại các bước thiết kế, hoặc đặt lại model về trạng thái ban đầu.',
  'tutorial.dontShowAgain': 'Không hiện lại',
  'tutorial.previous': 'Trước',
  'tutorial.next': 'Tiếp theo',
  'tutorial.finish': 'Hoàn tất',

  'tutorialPrompt.title': 'Bắt đầu',
  'tutorialPrompt.body': 'Bạn có muốn xem hướng dẫn tương tác không?',
  'tutorialPrompt.no': 'Không',
  'tutorialPrompt.yes': 'Có',

  // --- Wizard (image preprocessing) ---
  'wizard.title': 'Xử lý trước ảnh',
  'wizard.bestImageTitle': 'Ảnh như thế nào cho kết quả tốt nhất',
  'wizard.bestImage1': '<strong>Màu phẳng, đơn giản</strong> với các hình khối rõ ràng, tách biệt.',
  'wizard.bestImage2': '<strong>Hình minh họa 2D</strong>, logo, icon hoặc clipart chuyển đổi tốt nhất.',
  'wizard.worstImage':
    '<strong>Không phù hợp:</strong> ảnh chụp vật thể thật có bóng đổ, gradient hoặc texture thường không chuyển đổi tốt.',
  'wizard.missingDetails':
    'Bị mất chi tiết sau khi xử lý? Tăng <strong>Contrast</strong> và <strong>Exposure</strong> để ảnh rõ nét hơn và lấy lại chi tiết.',
  'wizard.cropRatio': 'Tỉ lệ cắt',
  'wizard.imageThickness': 'Độ dày ảnh',
  'wizard.imageAdjustment': 'Chỉnh ảnh',
  'wizard.noOutline': 'Không tìm thấy đường viền. Hãy chỉnh lại ảnh và thử lại.',
  'wizard.cancel': 'Hủy',
  'wizard.confirm': 'Xác nhận',
  'wizard.ratio.free': 'Tự do',
  'wizard.slider.exposure': 'Độ phơi sáng',
  'wizard.slider.contrast': 'Độ tương phản',
  'wizard.slider.saturation': 'Độ bão hòa',
  'wizard.slider.brightness': 'Độ sáng',
  'wizard.slider.whiteBalance': 'Cân bằng trắng',
  'wizard.slider.highlights': 'Vùng sáng',
  'wizard.slider.shadows': 'Vùng tối',

  // --- Status bar messages (main.ts) ---
  'status.loadingSwitchAssets': 'Đang tải dữ liệu switch…',
  'status.aiPromptCopied': 'Đã copy prompt ảnh AI ✓',
  'status.copyFailed': 'Không copy được, xem console.',
  'status.readingSvg': 'Đang đọc SVG…',
  'status.errorReadingSvg': 'Lỗi khi đọc SVG: {msg}',
  'status.selectedSvg': 'Đã chọn SVG: {name}. Bấm Tạo model để cập nhật.',
  'status.selectedIcon': 'Đã chọn icon: {name}. Bấm Tạo model để cập nhật.',
  'status.textUpdated': 'Đã cập nhật chữ. Bấm Tạo model để cập nhật.',
  'status.fontChanged': 'Đã đổi font. Bấm Tạo model để cập nhật.',
  'status.importingFont': 'Đang nhập font…',
  'status.fontImported': 'Đã nhập font {name}! Bấm Tạo model để cập nhật.',
  'status.fontImportFailed': 'Không nhập được font: {msg}',
  'status.ready': 'Sẵn sàng. Nhập một ảnh, SVG, icon, hoặc chữ.',
  'status.error': 'Lỗi: {msg}',
  'status.workerFailed': 'Worker lỗi: {msg}',
  'status.loadSwitchFailed': 'Không tải được dữ liệu switch: {msg}',
  'status.loadingDefaultClicker': 'Đang tải clicker mặc định…',
  'status.readingImage': 'Đang đọc ảnh…',
  'status.preprocessImage': 'Đang xử lý trước ảnh của bạn…',
  'status.readyDefault': 'Sẵn sàng.',
  'status.readyDropOrSample': 'Sẵn sàng. Thả một ảnh vào hoặc thử ảnh mẫu.',
  'status.readImageFailed': 'Không đọc được ảnh: {msg}',
  'status.removingBgTracing': 'Đang xóa nền & trace…',
  'status.uploadSvgFirst': 'Hãy tải một file SVG lên trước.',
  'status.parsingSvg': 'Đang phân tích SVG…',
  'status.selectIconFirst': 'Hãy chọn một icon trước.',
  'status.parsingIcon': 'Đang phân tích Icon…',
  'status.generatingText': 'Đang tạo Chữ…',
  'status.noOutlineFound': 'Không tìm thấy đường viền.',
  'status.waitingSwitchAssets': 'Đang chờ dữ liệu switch…',
  'status.buildingClicker': 'Đang dựng clicker…',
  'status.projectSaved': 'Đã lưu dự án ✓',
  'status.loadingProject': 'Đang mở dự án…',
  'status.loadProjectFailed': 'Không mở được dự án: {msg}',

  // --- Build warnings (generated in the geometry worker, no localStorage access
  // there, so translated here on the main thread by exact-matching the English text) ---
  'warning.switchesPulledTogether':
    'Các switch đã bị kéo sát lại để vừa với nắp — tăng Kích thước để có thêm khoảng trống.',
};

/**
 * Translate `key`; falls back to the given English text if the current
 * language is English or the key has no Vietnamese entry yet.
 */
export function t(key: string, en: string): string {
  if (getLang() === 'vi') {
    const v = VI[key];
    if (v !== undefined) return v;
  }
  return en;
}
