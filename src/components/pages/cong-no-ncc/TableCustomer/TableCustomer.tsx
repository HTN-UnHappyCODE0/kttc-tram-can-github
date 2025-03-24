import React from 'react';

import {PropsTableCustomer} from './interfaces';
import {useRouter} from 'next/router';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';

function TableCustomer({}: PropsTableCustomer) {
	const router = useRouter();

	const {_uuid, _page, _pageSize} = router.query;

	const listCustomer = useQuery([QUERY_KEY.table_khach_hang_doi_tac, _uuid, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: customerServices.listCustomer({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					keyword: '',
					specUuid: '',
					userUuid: '',
					provinceId: '',
					status: null,
					typeCus: null,
					partnerUUid: _uuid as string,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					isPaging: CONFIG_PAGING.IS_PAGING,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});
	return (
		<div className={'mt'}>
			<DataWrapper
				data={listCustomer.data?.items || []}
				loading={listCustomer.isLoading}
				noti={<Noti disableButton des='Hiện tại chưa có nhà cung cấp nào!' />}
			>
				<Table
					data={listCustomer.data?.items || []}
					column={[
						{
							title: 'Mã NCC',
							render: (data: any) => <>{data.code}</>,
						},
						{
							title: 'Tên NCC',
							render: (data: any) => <>{data.name}</>,
						},
						{
							title: 'Kho hàng',
							render: (data: any) => <>{data?.warehouseUu?.name || '---'}</>,
						},
						{
							title: 'Số điện thoại',
							render: (data: any) => <>{data.phoneNumber || '---'}</>,
						},
						{
							title: 'Email',
							render: (data: any) => <>{data.email || '---'}</>,
						},
						{
							title: 'Nhân viên',
							render: (data: any) => <>{data?.userUu?.fullName || '---'}</>,
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				total={listCustomer?.data?.pagination?.totalCount}
				pageSize={Number(_pageSize) || 200}
				dependencies={[_pageSize, _uuid]}
			/>
		</div>
	);
}

export default TableCustomer;
