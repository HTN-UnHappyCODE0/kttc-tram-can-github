import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageDebtCompany from '~/components/pages/cong-no-ncc/PageDebtCompany';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Danh sách công nợ công ty</title>
				<meta name='description' content='Danh sách công nợ công ty' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<WrapperContainer bg={true}>
				<PageDebtCompany />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Danh sách công nợ công ty'>{Page}</BaseLayout>;
};
