import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import CreateFuturePriceTag from '~/components/pages/gia-tien-hang-tuong-lai/CreateFuturePriceTag';
export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm giá tiền hàng tương lai</title>
				<meta name='description' content='Thêm giá tiền hàng tương lai' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<CreateFuturePriceTag />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm giá tiền hàng tương lai'>{Page}</BaseLayout>;
};
