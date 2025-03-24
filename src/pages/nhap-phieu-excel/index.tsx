import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainImportData from '~/components/pages/nhap-phieu-excel/MainImportData';

export default function Home() {
	return (
		<Fragment>
			<Head>
				<title>Import phiếu từ excel</title>
				<meta name='description' content='Import phiếu từ excel' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<MainImportData />
			</WrapperContainer>
		</Fragment>
	);
}

Home.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Import phiếu từ excel'>
			{Page}
		</BaseLayout>
	);
};
