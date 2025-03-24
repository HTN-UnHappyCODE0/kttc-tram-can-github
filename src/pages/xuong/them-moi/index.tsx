import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageCreateWorkshop from '~/components/pages/xuong/PageCreateWorkshop';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới nhà cung cấp</title>
				<meta name='description' content='Thêm mới nhà cung cấp' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<PageCreateWorkshop />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Thêm mới nhà cung cấp'>
			{Page}
		</BaseLayout>
	);
};
