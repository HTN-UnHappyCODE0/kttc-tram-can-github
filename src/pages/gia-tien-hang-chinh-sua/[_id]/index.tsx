import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainDetailPriceTagUpdate from '~/components/pages/gia-tien-hang-chinh-sua/MainDetailPriceTagUpdate';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết giá tiền hàng cập nhật</title>
				<meta name='description' content='Chi tiết giá tiền hàng cập nhật' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainDetailPriceTagUpdate />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết giá tiền hàng cập nhật'>{Page}</BaseLayout>;
};
