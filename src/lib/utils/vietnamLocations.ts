// Vietnam provinces data - Only HCM and Binh Duong
export const provinces = [
  { code: "HCM", name: "TP. Hồ Chí Minh" },
  { code: "BD", name: "Bình Dương" },
];

export const districts: Record<string, { code: string; name: string }[]> = {
  HCM: [
    { code: "Q1", name: "Quận 1" },
    { code: "Q2", name: "Quận 2" },
    { code: "Q3", name: "Quận 3" },
    { code: "Q4", name: "Quận 4" },
    { code: "Q5", name: "Quận 5" },
    { code: "Q6", name: "Quận 6" },
    { code: "Q7", name: "Quận 7" },
    { code: "Q8", name: "Quận 8" },
    { code: "Q9", name: "Quận 9" },
    { code: "Q10", name: "Quận 10" },
    { code: "Q11", name: "Quận 11" },
    { code: "Q12", name: "Quận 12" },
    { code: "TB", name: "Quận Tân Bình" },
    { code: "TP", name: "Quận Tân Phú" },
    { code: "PN", name: "Quận Phú Nhuận" },
    { code: "BT", name: "Quận Bình Thạnh" },
    { code: "TD", name: "TP. Thủ Đức" },
    { code: "GV", name: "Quận Gò Vấp" },
    { code: "BTan", name: "Quận Bình Tân" },
    { code: "BC", name: "Huyện Bình Chánh" },
    { code: "HC", name: "Huyện Hóc Môn" },
    { code: "CC", name: "Huyện Củ Chi" },
    { code: "NH", name: "Huyện Nhà Bè" },
    { code: "CG", name: "Huyện Cần Giờ" },
  ],
  BD: [
    { code: "TDM", name: "TP. Thủ Dầu Một" },
    { code: "TAN", name: "TP. Thuận An" },
    { code: "DAN", name: "TP. Dĩ An" },
    { code: "BD", name: "TX. Bến Cát" },
    { code: "TA", name: "TX. Tân Uyên" },
    { code: "TH", name: "Huyện Bàu Bàng" },
    { code: "DA", name: "Huyện Dầu Tiếng" },
    { code: "PC", name: "Huyện Phú Giáo" },
  ],
};

export const wards: Record<string, string[]> = {
  // Quận 1
  Q1: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Nguyễn Thái Bình", "Phường Phạm Ngũ Lão", "Phường Cầu Ông Lãnh", "Phường Đa Kao", "Phường Tân Định", "Phường Cô Giang", "Phường Nguyễn Cư Trinh", "Phường Cầu Kho"],
  // Quận 2
  Q2: ["Phường Thảo Điền", "Phường An Phú", "Phường Bình An", "Phường Bình Trưng Đông", "Phường Bình Trưng Tây", "Phường Bình Khánh", "Phường An Khánh", "Phường Cát Lái", "Phường Thạnh Mỹ Lợi", "Phường An Lợi Đông", "Phường Thủ Thiêm"],
  // Quận 3
  Q3: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"],
  // Quận 4
  Q4: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 08", "Phường 09", "Phường 10", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 18"],
  // Quận 5
  Q5: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
  // Quận 6
  Q6: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"],
  // Quận 7
  Q7: ["Phường Tân Thuận Đông", "Phường Tân Thuận Tây", "Phường Tân Kiểng", "Phường Tân Hưng", "Phường Bình Thuận", "Phường Tân Quy", "Phường Phú Thuận", "Phường Tân Phú", "Phường Tân Phong", "Phường Phú Mỹ"],
  // Quận 8
  Q8: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
  // Quận 9
  Q9: ["Phường Long Bình", "Phường Long Thạnh Mỹ", "Phường Tân Phú", "Phường Hiệp Phú", "Phường Tăng Nhơn Phú A", "Phường Tăng Nhơn Phú B", "Phường Phước Long A", "Phường Phước Long B", "Phường Trường Thạnh", "Phường Long Phước", "Phường Long Trường", "Phường Phước Bình", "Phường Phú Hữu"],
  // Quận 10
  Q10: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
  // Quận 11
  Q11: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
  // Quận 12
  Q12: ["Phường Thạnh Xuân", "Phường Thạnh Lộc", "Phường Hiệp Thành", "Phường Thới An", "Phường Tân Chánh Hiệp", "Phường An Phú Đông", "Phường Tân Thới Hiệp", "Phường Trung Mỹ Tây", "Phường Tân Hưng Thuận", "Phường Đông Hưng Thuận", "Phường Tân Thới Nhất"],
  // Tân Bình
  TB: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
  // Tân Phú
  TP: ["Phường Tân Sơn Nhì", "Phường Tây Thạnh", "Phường Sơn Kỳ", "Phường Tân Quý", "Phường Tân Thành", "Phường Phú Thọ Hòa", "Phường Phú Thạnh", "Phường Phú Trung", "Phường Hòa Thạnh", "Phường Hiệp Tân", "Phường Tân Thới Hòa"],
  // Phú Nhuận
  PN: ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 15", "Phường 17"],
  // Bình Thạnh
  BT: ["Phường 01", "Phường 02", "Phường 03", "Phường 05", "Phường 06", "Phường 07", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17", "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25", "Phường 26", "Phường 27", "Phường 28"],
  // Thủ Đức
  TD: ["Phường Linh Xuân", "Phường Bình Chiểu", "Phường Linh Trung", "Phường Tam Bình", "Phường Tam Phú", "Phường Hiệp Bình Phước", "Phường Hiệp Bình Chánh", "Phường Linh Chiểu", "Phường Linh Tây", "Phường Linh Đông", "Phường Bình Thọ", "Phường Trường Thọ"],
  // Gò Vấp
  GV: ["Phường 01", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 17"],
  // Bình Tân
  BTan: ["Phường Bình Hưng Hòa", "Phường Bình Hưng Hoà A", "Phường Bình Hưng Hoà B", "Phường Bình Trị Đông", "Phường Bình Trị Đông A", "Phường Bình Trị Đông B", "Phường Tân Tạo", "Phường Tân Tạo A", "Phường An Lạc", "Phường An Lạc A"],
  // Bình Chánh
  BC: ["Xã Bình Hưng", "Xã Phạm Văn Hai", "Xã Vĩnh Lộc A", "Xã Vĩnh Lộc B", "Xã Bình Lợi", "Xã Lê Minh Xuân", "Xã Tân Nhựt", "Xã Tân Kiên", "Xã Bình Hưng Hòa", "Xã Phong Phú"],
  // Hóc Môn
  HC: ["Xã Tân Hiệp", "Xã Nhị Bình", "Xã Đông Thạnh", "Xã Tân Thới Nhì", "Xã Thới Tam Thôn", "Xã Xuân Thới Sơn", "Xã Tân Xuân", "Xã Xuân Thới Đông", "Xã Trung Chánh", "Xã Xuân Thới Thượng", "Xã Bà Điểm"],
  // Củ Chi
  CC: ["Xã Phú Mỹ Hưng", "Xã An Phú", "Xã Trung Lập Thượng", "Xã An Nhơn Tây", "Xã Nhuận Đức", "Xã Phạm Văn Cội", "Xã Phú Hòa Đông", "Xã Trung Lập Hạ", "Xã Trung An", "Xã Phước Thạnh", "Xã Phước Hiệp"],
  // Nhà Bè
  NH: ["Xã Phước Kiển", "Xã Phước Lộc", "Xã Nhơn Đức", "Xã Phú Xuân", "Xã Long Thới", "Xã Hiệp Phước"],
  // Cần Giờ
  CG: ["Xã An Thới Đông", "Xã Bình Khánh", "Xã Tam Thôn Hiệp", "Xã Lý Nhơn", "Xã Long Hòa", "Xã Thạnh An"],
  
  // Bình Dương Districts
  TDM: ["Phường Hiệp Thành", "Phường Phú Lợi", "Phường Phú Cường", "Phường Phú Hòa", "Phường Phú Thọ", "Phường Chánh Nghĩa", "Phường Định Hoà", "Phường Hoà Phú", "Phường Phú Mỹ", "Phường Phú Tân", "Phường Tân An", "Phường Hiệp An", "Phường Tương Bình Hiệp", "Phường Chánh Mỹ"],
  TAN: ["Phường Bình Thang", "Phường Bình Chuẩn", "Phường Thuận Giao", "Phường An Thạnh", "Phường Lái Thiêu", "Phường Bình Nhâm", "Phường Bình Hòa", "Phường Vĩnh Phú", "Phường An Phú", "Phường Hưng Định"],
  DAN: ["Phường Dĩ An", "Phường Tân Bình", "Phường Tân Đông Hiệp", "Phường Bình An", "Phường Bình Thắng", "Phường Đông Hòa", "Phường An Bình"],
  BD: ["Phường Mỹ Phước", "Phường Chánh Phú Hòa", "Xã An Điền", "Xã An Tây", "Phường Thới Hòa", "Phường Hòa Lợi", "Phường Tân Định", "Xã Phú An"],
  TA: ["Phường Uyên Hưng", "Phường Tân Phước Khánh", "Phường Vĩnh Tân", "Phường Hội Nghĩa", "Phường Tân Hiệp", "Phường Khánh Bình", "Phường Phú Chánh", "Phường Bạch Đằng", "Xã Thạnh Phước", "Xã Thạnh Hội"],
  TH: ["Xã Trừ Văn Thố", "Xã Cây Trường II", "Xã Lai Uyên", "Xã Tân Hưng", "Xã Long Nguyên", "Xã Hưng Hòa", "Xã Lai Hưng"],
  DA: ["Xã Minh Hoà", "Xã Minh Thạnh", "Xã Minh Tân", "Xã Định An", "Xã Long Hoà", "Xã Định Thành", "Xã Định Hiệp", "Xã An Lập"],
  PC: ["Xã Phước Vĩnh", "Xã An Linh", "Xã Phước Sang", "Xã An Thái", "Xã An Long", "Xã An Bình", "Xã Tân Hiệp", "Xã Tam Lập", "Xã Tân Long", "Xã Vĩnh Hoà"],
};
