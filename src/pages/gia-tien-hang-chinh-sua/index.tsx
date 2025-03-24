import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPriceTagUpdate from '~/components/pages/gia-tien-hang-chinh-sua/MainPriceTagUpdate';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý giá tiền hàng chỉnh sửa</title>
				<meta name='description' content='Quản lý giá tiền hàng chỉnh sửa' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPriceTagUpdate />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Quản lý giá tiền hàng chỉnh sửa'>
			{Page}
		</BaseLayout>
	);
};
