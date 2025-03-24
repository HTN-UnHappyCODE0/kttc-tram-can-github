export function isEmail(value: string) {
	return !!value
		?.trim()
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
}

export function isPhoneNumber(phoneNumber: string) {
	const vietnamPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

	return vietnamPhoneRegex.test(phoneNumber);
}
