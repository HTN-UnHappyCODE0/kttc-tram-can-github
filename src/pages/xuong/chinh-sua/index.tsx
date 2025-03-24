import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageUpdateWorkshop from '~/components/pages/xuong/PageUpdateWorkshop';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa nhà cung cấp</title>
				<meta name='description' content='Chỉnh sửa nhà cung cấp' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<PageUpdateWorkshop />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chỉnh sửa nhà cung cấp'>
			{Page}
		</BaseLayout>
	);
};
