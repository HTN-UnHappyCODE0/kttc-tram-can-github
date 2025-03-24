import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPage from '~/components/pages/phieu-da-hoan-thanh/MainPage';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Công nợ phiếu đã hoàn thành</title>
				<meta name='description' content='Công nợ phiếu đã hoàn thành' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPage />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Công nợ phiếu đã hoàn thành'>{Page}</BaseLayout>;
};
