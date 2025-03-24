export enum QUERY_KEY {
	dropdown_khach_hang,
	dropdown_nhan_vien_thi_truong,
	dropdown_chuc_vu,
	dropdown_nha_cung_cap,
	dropdown_tinh_thanh_pho,
	dropdown_quan_huyen,
	dropdown_xa_phuong,
	dropdown_nguoi_quan_ly_nhap_hang,
	dropdown_tinh_thanh_pho_quan_ly,
	dropdown_nguoi_quan_ly_nhan_vien,
	dropdown_quan_ly_nhap_hang,
	dropdown_cong_ty,
	dropdown_loai_hang,
	dropdown_quy_cach,
	dropdown_loai_go,
	dropdown_gia_tien_hang,
	dropdown_gia_tien_hang_tuong_lai,
	dropdown_xuong,
	dropdown_kho_hang_chinh,
	dropdown_bai,
	dropdown_xe_hang,
	dropdown_quoc_gia,

	table_phieu_hang_tat_ca,
	table_phieu_hang_chua_kcs,
	table_phieu_hang_da_kcs,
	table_cong_no_phieu,
	table_cong_no_phieu_nha_cung_cap,
	table_cong_no_phieu_hoan_thanh,
	table_cong_no_phieu_da_kcs,
	table_cong_no_phieu_chua_kcs,
	table_cong_no_nha_cung_cap,
	table_lich_su_thanh_toan,
	table_lich_su_thanh_toan_doi_tac,
	table_khach_hang_doi_tac,
	table_tong_hop_cong_no,
	table_tong_hop_cong_no_doi_tac,
	table_do_kho_doi_duyet,
	table_gia_tien_hang,
	table_gia_tien_lich_su,
	table_lich_su_gia_tien_hang,
	table_phieu_can,
	table_gia_tien_hang_tuong_lai,
	table_hang_hoa_cua_khach_hang,
	table_tram_can,

	chi_tiet_phieu_hang,
	chi_tiet_cong_no_phieu,
	chi_tiet_lich_su_thanh_toan,
	chi_tiet_doi_tac,
	chi_tiet_doi_tac_thanh_toan,
	chi_tiet_doi_tac_thue,
	chi_tiet_doi_tac_thu_hoi,
	chi_tiet_nhan_vien,
	chi_tiet_gia_tien_chinh_sua,
	chi_tiet_nha_cung_cap,
	chi_tiet_khach_hang,
	chi_tiet_gia_tien_hang,

	thong_ke_trang_chu_cong_no,
	thong_ke_trang_chu_nha_cung_cap,
	thong_ke_luong_du_lieu_duyet_khoi_luong,
	thong_ke_luong_du_lieu_duyet_do_kho,
}

export enum TYPE_DATE {
	ALL = -1,
	TODAY = 1,
	YESTERDAY = 2,
	THIS_WEEK = 3,
	LAST_WEEK = 4,
	THIS_MONTH = 5,
	LAST_MONTH = 6,
	THIS_YEAR = 7,
	LAST_7_DAYS = 8,
	LUA_CHON = 9,
}

export enum GENDER {
	NAM,
	NU,
	KHAC,
}

export enum CONDITION {
	BIG,
	SMALL,
}

// ENUM API CONFIG
export enum CONFIG_STATUS {
	BI_KHOA,
	HOAT_DONG,
}

export enum CONFIG_PAGING {
	NO_PAGING,
	IS_PAGING,
}

export enum CONFIG_DESCENDING {
	NO_DESCENDING,
	IS_DESCENDING,
}

export enum CONFIG_TYPE_FIND {
	DROPDOWN,
	FILTER,
	TABLE,
}

export enum TYPE_TRANSPORT {
	DUONG_BO,
	DUONG_THUY,
}

export enum STATUS_BILL {
	DA_HUY,
	CHUA_CAN,
	DANG_CAN,
	TAM_DUNG,
	DA_CAN_CHUA_KCS,
	DA_KCS,
	CHOT_KE_TOAN,
}

export enum STATE_BILL {
	NOT_CHECK = 0,
	QLK_REJECTED,
	QLK_CHECKED,
	KTK_REJECTED,
	KTK_CHECKED,
	END,
}

export enum STATUS_WEIGHT_SESSION {
	DA_HUY,
	CAN_LAN_1,
	CAN_LAN_2,
	UPDATE_SPEC_DONE,
	UPDATE_DRY_DONE,
	KCS_XONG,
	CHOT_KE_TOAN,
}

// PAGE CUSTOMER
export enum STATUS_CUSTOMER {
	DA_XOA = -1,
	DUNG_HOP_TAC,
	HOP_TAC,
}

export enum TYPE_CUSTOMER {
	KH_NHAP = 1,
	KH_XUAT,
	KH_DICH_VU,
}

export enum TYPE_SIFT {
	KHONG_SANG,
	DA_SANG,
}

// PAGE DEBT
export enum STATUS_DEBT {
	THANH_TOAN,
	TAM_UNG,
}

// PAGE PRICE
export enum STATUS_STANDARD {
	DANG_AP_DUNG,
	NGUNG_AP_DUNG,
}

// PAGE TRUCK
export enum OWNEW_TYPE_TRUCK {
	XE_CONG_TY,
	XE_KHACH_HANG,
}

export enum TYPE_PARTNER {
	NCC = 1,
	KH_XUAT,
	KH_DICH_VU,
}

export enum TYPE_GROUPBY {
	NGAY = 1, // Xem theo ngày
	THANG, // Xem theo tháng
	THOI_GIAN_LOC, // Xem theo khoảng thời gian lọc
}

export enum STATUS_TRANSACTION {
	DA_XOA,
	BINH_THUONG,
}

export enum TYPE_TRANSACTION {
	THANH_TOAN = 1,
	THU_HOI,
	THUE,
}

// COMON REGENCY
export enum REGENCY_NAME {
	'Nhân viên tài chính - kế toán' = '9',
	'Nhân viên KCS' = '8',
	'Nhân viên thị trường' = '7',
	'Nhân viên cân' = '6',
	'Quản lý xe' = '5',
	'Quản lý nhập hàng' = '4',
	'Quản lý kho KCS' = '3',
	'Phó Giám Đốc' = '2',
	'Giám Đốc' = '1',
	'Kế toán tổng' = '12',
}

export enum TYPE_LOGIN {
	ADMIN = 1,
	KHO,
	KE_TOAN,
	NHAP_HANG,
}

export enum STATUS_CONFIRM {
	DA_HUY,
	DANG_DOI,
	DA_CHOT,
}

export enum TYPE_BATCH {
	CAN_LE,
	CAN_LO,
	KHONG_CAN,
	IMPORT_EXCEL,
}

export enum TYPE_PRODUCT {
	CONG_TY = 1,
	DICH_VU,
	DUNG_CHUNG,
}

export enum CONFIG_STATE_SPEC_CUSTOMER {
	CHUA_CUNG_CAP,
	DANG_CUNG_CAP,
}

export enum TYPE_PRICE_FUTURE {
	DA_HUY,
	CHUA_AP_DUNG,
	DANG_AP_DUNG,
	DA_KET_THUC,
}

export enum TYPE_SCALES {
	CAN_NHAP = 1,
	CAN_XUAT,
	CAN_DICH_VU,
	CAN_CHUYEN_KHO,
	CAN_TRUC_TIEP,
}

export enum TYPE_CHECK_DAY_BILL {
	THOI_GIAN_QLK_DUYET = 1,
	THOI_GIAN_KTK_DUYET = 2,
}
