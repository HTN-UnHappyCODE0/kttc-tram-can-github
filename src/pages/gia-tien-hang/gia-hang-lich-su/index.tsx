import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainHistoryChangePriceTag from '~/components/pages/gia-tien-hang/MainHistoryChangePriceTag';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý giá tiền hàng</title>
				<meta name='description' content='Quản lý giá tiền hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Giá hàng hiện tại',
						url: PATH.GiaTienHangHienTai,
					},
					{
						title: 'Lịch sử giá hàng',
						url: PATH.GiaTienHangLichSu,
					},
				]}
			>
				<MainHistoryChangePriceTag />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Quản lý giá tiền hàng'>
			{Page}
		</BaseLayout>
	);
};
