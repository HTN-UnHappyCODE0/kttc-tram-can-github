import icons from '../images/icons';
import {TYPE_DATE} from './enum';

export const MAXIMUM_FILE = 10; //MB

export const allowFiles = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/jpg',
	'image/png',
];

export enum PATH {
	Any = 'any',
	Login = '/auth/login',
	ForgotPassword = '/auth/forgot-password',
	Home = '/',

	Profile = '/profile',

	PhieuChuaHoanThanh = '/phieu-chua-hoan-thanh/tat-ca',
	PhieuChuaHoanThanhChuaKCS = '/phieu-chua-hoan-thanh/chua-kcs',
	PhieuChuaHoanThanhDaKCS = '/phieu-chua-hoan-thanh/da-kcs',

	PhieuDaHoanThanh = '/phieu-da-hoan-thanh',

	CongNoNCC = '/cong-no-ncc',

	LichSu = '/lich-su-thanh-toan',
	TongHopCongNo = '/tong-hop-cong-no',

	// Giá tiền hàng
	GiaTien = '/gia-tien-hang',
	GiaTienHangHienTai = '/gia-tien-hang/gia-hang-hien-tai',
	// GiaTienHangQuaKhu = '/gia-tien-hang/gia-hang-chinh-sua',
	GiaTienHangLichSu = '/gia-tien-hang/gia-hang-lich-su',
	ThemGiaTien = '/gia-tien-hang/them-moi',
	// ThemThayDoiGiaTien = '/gia-tien-hang/them-gia-hang-chinh-sua',
	ChinhSuaGiaTien = '/gia-tien-hang/chinh-sua',

	//Giá tiền hàng tương lai
	GiaTienHangTuongLai = '/gia-tien-hang-tuong-lai',
	ThemGiaTienHangTuongLai = '/gia-tien-hang-tuong-lai/them-moi',

	// Giá tiền hàng chỉnh sửa
	GiaTienHangChinhSua = '/gia-tien-hang-chinh-sua',
	ThemThayDoiGiaTienChinhSua = '/gia-tien-hang-chinh-sua/them-gia-hang-chinh-sua',

	// Duyệt lại đồ khô
	DuyetLaiDoKho = '/duyet-lai-do-kho',

	NhapPhieuExcel = '/nhap-phieu-excel',
}

export const Menu: {
	title: string;
	group: {
		path: string;
		pathActive?: string;
		title: string;
		icon: any;
	}[];
}[] = [
	{
		title: 'Tổng quan',
		group: [{title: 'Tổng quan', icon: icons.tongQuan, path: PATH.Home}],
	},
	{
		title: 'Quản lý',
		group: [
			{title: 'Phiếu chưa hoàn thành', icon: icons.phieuhang, path: PATH.PhieuChuaHoanThanh, pathActive: '/phieu-chua-hoan-thanh'},
			{title: 'Phiếu đã hoàn thành', icon: icons.phieuDaHoanThanh, path: PATH.PhieuDaHoanThanh},
			{title: 'Công nợ công ty', icon: icons.iconNhaCungCap, path: PATH.CongNoNCC, pathActive: PATH.CongNoNCC},
			{title: 'Lịch sử thanh toán', icon: icons.iconLichSuThanhToan, path: PATH.LichSu},
			{title: 'Tổng hợp công nợ', icon: icons.tonghopcongno, path: PATH.TongHopCongNo},
		],
	},
	{
		title: 'Nhập hàng',
		group: [
			{
				title: 'Duyệt độ khô',
				icon: icons.duyetdokho,
				path: PATH.DuyetLaiDoKho,
				pathActive: PATH.DuyetLaiDoKho,
			},
			{
				title: 'Giá tiền hàng',
				icon: icons.giatienhang,
				path: PATH.GiaTienHangHienTai,
				pathActive: PATH.GiaTien,
			},
			{
				title: 'Giá tiền hàng chỉnh sửa',
				icon: icons.giatienhangchinhsua,
				path: PATH.GiaTienHangChinhSua,
			},
			{
				title: 'Giá tiền hàng tương lai',
				icon: icons.giatienhangtuonglai,
				path: PATH.GiaTienHangTuongLai,
			},
			{
				title: 'Nhập phiếu từ excel',
				icon: icons.nhapphieuexcel,
				path: PATH.NhapPhieuExcel,
			},
		],
	},
];

export const KEY_STORE = 'KTTC-TRAM-CAN';

export const ListOptionTimePicker: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	{
		name: 'Hôm qua',
		value: TYPE_DATE.YESTERDAY,
	},
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	{
		name: 'Tuần trước',
		value: TYPE_DATE.LAST_WEEK,
	},
	{
		name: '7 ngày trước',
		value: TYPE_DATE.LAST_7_DAYS,
	},
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	{
		name: 'Tháng trước',
		value: TYPE_DATE.LAST_MONTH,
	},
	{
		name: 'Năm này',
		value: TYPE_DATE.THIS_YEAR,
	},
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];
