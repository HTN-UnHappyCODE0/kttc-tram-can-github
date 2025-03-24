import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainHistoryPriceTag from '~/components/pages/gia-tien-hang/MainHistoryPriceTag';
export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lịch sử giá tiền hàng</title>
				<meta name='description' content='Lịch sử giá tiền hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainHistoryPriceTag />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Lịch sử giá tiền hàng'>
			{Page}
		</BaseLayout>
	);
};
