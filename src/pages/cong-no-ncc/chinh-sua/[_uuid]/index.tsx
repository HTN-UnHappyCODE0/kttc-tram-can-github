import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageUpdatePartner from '~/components/pages/cong-no-ncc/PageUpdatePartner';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa công ty</title>
				<meta name='description' content='Chỉnh sửa công ty' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<WrapperContainer bg={true}>
				<PageUpdatePartner />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa công ty'>{Page}</BaseLayout>;
};
