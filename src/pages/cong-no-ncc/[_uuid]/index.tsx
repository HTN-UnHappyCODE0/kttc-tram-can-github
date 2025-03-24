import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageDetailPartner from '~/components/pages/cong-no-ncc/PageDetailPartner';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết công nợ công ty</title>
				<meta name='description' content='Chi tiết công nợ công ty' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<WrapperContainer bg={true}>
				<PageDetailPartner />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết công nợ công ty'>{Page}</BaseLayout>;
};
