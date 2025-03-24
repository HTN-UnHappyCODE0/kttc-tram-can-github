import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageDebtHistory from '~/components/pages/lich-su-thanh-toan/PageDebtHistory';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Lịch sử thanh toán</title>
				<meta name='description' content='Lịch sử thanh toán' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<PageDebtHistory />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Lịch sử thanh toán'>{Page}</BaseLayout>;
};
