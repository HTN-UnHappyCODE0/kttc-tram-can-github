import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPageAll from '~/components/pages/phieu-chua-hoan-thanh/MainPageAll';
import {PATH} from '~/constants/config';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Công nợ phiếu chưa hoàn thành</title>
				<meta name='description' content='Công nợ phiếu chưa hoàn thành' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<LayoutPages
				listPages={[
					{
						title: 'Tất cả',
						url: PATH.PhieuChuaHoanThanh,
					},
					{
						title: 'Phiếu chưa KCS',
						url: PATH.PhieuChuaHoanThanhChuaKCS,
					},
					{
						title: 'Phiếu đã KCS',
						url: PATH.PhieuChuaHoanThanhDaKCS,
					},
				]}
			>
				<MainPageAll />
			</LayoutPages>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý công nợ phiếu'>{Page}</BaseLayout>;
};
