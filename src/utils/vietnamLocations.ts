// Vietnam provinces data - simplified for common areas
export const provinces = [
  { code: "HCM", name: "TP. Hồ Chí Minh" },
  { code: "HN", name: "Hà Nội" },
  { code: "DN", name: "Đà Nẵng" },
  { code: "HP", name: "Hải Phòng" },
  { code: "CT", name: "Cần Thơ" },
  { code: "BD", name: "Bình Dương" },
  { code: "DNA", name: "Đồng Nai" },
  { code: "KH", name: "Khánh Hòa" },
  { code: "LA", name: "Long An" },
  { code: "BTH", name: "Bà Rịa - Vũng Tàu" },
];

export const districts: Record<string, { code: string; name: string }[]> = {
  HCM: [
    { code: "Q1", name: "Quận 1" },
    { code: "Q3", name: "Quận 3" },
    { code: "Q5", name: "Quận 5" },
    { code: "Q10", name: "Quận 10" },
    { code: "TB", name: "Quận Tân Bình" },
    { code: "PN", name: "Quận Phú Nhuận" },
    { code: "BT", name: "Quận Bình Thạnh" },
    { code: "TD", name: "Quận Thủ Đức" },
    { code: "GV", name: "Quận Gò Vấp" },
    { code: "Q7", name: "Quận 7" },
    { code: "BC", name: "Huyện Bình Chánh" },
    { code: "HC", name: "Huyện Hóc Môn" },
    { code: "CC", name: "Huyện Củ Chi" },
  ],
  HN: [
    { code: "HK", name: "Quận Hoàn Kiếm" },
    { code: "BD", name: "Quận Ba Đình" },
    { code: "DD", name: "Quận Đống Đa" },
    { code: "HM", name: "Quận Hai Bà Trưng" },
    { code: "CG", name: "Quận Cầu Giấy" },
    { code: "TX", name: "Quận Thanh Xuân" },
    { code: "HD", name: "Quận Hoàng Mai" },
    { code: "LB", name: "Quận Long Biên" },
  ],
};

export const wards: Record<string, string[]> = {
  // Quận 1, HCM
  Q1: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Nguyễn Thái Bình", "Phường Phạm Ngũ Lão", "Phường Cầu Ông Lãnh"],
  // Quận 3, HCM
  Q3: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06"],
  // Add more as needed...
};
