import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainReviewDryness from '~/components/pages/duyet-lai-do-kho/MainReviewDryness';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Duyệt độ khô</title>
				<meta name='description' content='Duyệt độ khô' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainReviewDryness />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Duyệt độ khô'>
			{Page}
		</BaseLayout>
	);
};
