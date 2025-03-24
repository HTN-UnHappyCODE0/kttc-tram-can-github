import moment from 'moment';
import md5 from 'md5';

export function obfuscateEmail(email: string) {
	// Tách phần trước @ và phần tên miền
	const [username, domain] = email.split('@');

	// Giữ lại ký tự đầu tiên và cuối cùng của tên người dùng
	const firstChar = username[0];
	const lastChar = username[username.length - 1];

	// Tạo phần che giấu giữa
	const middleHidden = '...';

	// Tạo tên người dùng mới với phần che giấu
	const newUsername = firstChar + middleHidden + lastChar;

	// Kết hợp với tên miền để tạo email đã che giấu
	const obfuscatedEmail = newUsername + '@' + domain;

	return obfuscatedEmail;
}

export function checkTime(i: any) {
	if (Math.abs(i) < 10) {
		i = '0' + i;
	}
	return i;
}

export const timeSubmit = (date: Date | null | undefined, isTo?: boolean) => {
	return date
		? `${date.getFullYear()}-${checkTime(date.getMonth() + 1)}-${checkTime(date.getDate())}T${isTo ? '23:59:59' : '00:00:00'}`
		: null;
};

export function getKeyCert(): {
	time: string;
	keyCert: string;
} {
	const key: string = process.env.NEXT_PUBLIC_KEY_CERT!;
	const time = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
	return {
		time: time,
		keyCert: md5(`${key}${time}`),
	};
}

export function removeVietnameseTones(str: string): string {
	str = str?.toLowerCase();
	str = str?.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	str = str?.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	str = str?.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	str = str?.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	str = str?.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	str = str?.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	str = str?.replace(/đ/g, 'd');
	return str;
}

export function getTextAddress(detailAddress: any, address?: string): string {
	if (address) {
		return `${address || '---'}, ${detailAddress?.town?.name || '---'}, ${detailAddress?.district?.name || '---'}, ${
			detailAddress?.province?.name || '---'
		}`;
	} else {
		return `${detailAddress?.town?.name || '---'}, ${detailAddress?.district?.name || '---'}, ${
			detailAddress?.province?.name || '---'
		}`;
	}
}

export function convertWeight(weight: number | null) {
	if (!weight) {
		return 0;
	}

	return (weight / 1000).toLocaleString('vi-VN', {minimumFractionDigits: 3, maximumFractionDigits: 3});
}

export function formatDrynessAvg(drynessAvg: number | null) {
	if (!drynessAvg) {
		return 0;
	}

	const roundedNum = Math.floor(drynessAvg * 100) / 100;

	return roundedNum.toFixed(2).replace('.', ',');
}

export function convertFileSize(fileSizeInKB: number) {
	if (typeof fileSizeInKB !== 'number' || fileSizeInKB < 0) {
		return 'Kích thước không hợp lệ';
	}

	if (fileSizeInKB < 1024) {
		return fileSizeInKB.toFixed(2) + ' kb';
	} else if (fileSizeInKB < 1048576) {
		// 1024 KB = 1 MB
		return (fileSizeInKB / 1024).toFixed(2) + ' mb';
	} else if (fileSizeInKB < 1073741824) {
		// 1024 MB = 1 GB
		return (fileSizeInKB / 1048576).toFixed(2) + ' gb';
	} else {
		return (fileSizeInKB / 1073741824).toFixed(2) + ' tb';
	}
}

export function numberToWords(number: number) {
	if (typeof number !== 'number' || isNaN(number)) {
		return 'Không hợp lệ';
	}

	if (number === 0) {
		return 'Không đồng';
	}

	const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
	const levels = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];

	function readThreeDigits(num: number) {
		let str = '';
		const hundred = Math.floor(num / 100);
		const ten = Math.floor((num % 100) / 10);
		const unit = num % 10;

		if (hundred > 0) {
			str += units[hundred] + ' trăm';
			if (ten === 0 && unit > 0) str += ' linh';
		}

		if (ten > 1) {
			str += ' ' + units[ten] + ' mươi';
			if (unit === 1) str += ' mốt';
			else if (unit === 5) str += ' lăm';
			else if (unit > 0) str += ' ' + units[unit];
		} else if (ten === 1) {
			str += ' mười';
			if (unit > 0) str += ' ' + units[unit];
		} else if (unit > 0) {
			str += ' ' + units[unit];
		}

		return str.trim();
	}

	function splitIntoChunks(num: number) {
		const chunks = [];
		while (num > 0) {
			chunks.push(num % 1000);
			num = Math.floor(num / 1000);
		}
		return chunks;
	}

	const chunks = splitIntoChunks(number);
	let result = '';

	for (let i = chunks.length - 1; i >= 0; i--) {
		if (chunks[i] > 0) {
			result += readThreeDigits(chunks[i]) + ' ' + levels[i] + ' ';
		}
	}

	result = result.trim().replace(/\s+/g, ' ');
	result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
	return result;
}
