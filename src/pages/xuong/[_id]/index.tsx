import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageDetailWorkshop from '~/components/pages/xuong/PageDetailWorkshop';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết nhà cung cấp</title>
				<meta name='description' content='Chi tiết nhà cung cấp' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<PageDetailWorkshop />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Quản lý nhà cung cấp'>
			{Page}
		</BaseLayout>
	);
};
