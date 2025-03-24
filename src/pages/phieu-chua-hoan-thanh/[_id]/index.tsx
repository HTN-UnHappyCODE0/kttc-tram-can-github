import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageDetail from '~/components/pages/phieu-chua-hoan-thanh/MainPageDetail';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết công nợ phiếu chưa hoàn thành</title>
				<meta name='description' content='Chi tiết công nợ phiếu chưa hoàn thành' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageDetail />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chi tiết công nợ phiếu chưa hoàn thành'>
			{Page}
		</BaseLayout>
	);
};
