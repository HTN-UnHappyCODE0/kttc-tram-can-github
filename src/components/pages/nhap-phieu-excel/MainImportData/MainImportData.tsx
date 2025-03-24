import React, {useMemo, useState} from 'react';
import * as XLSX from 'xlsx';

import {PropsMainImportData} from './interfaces';
import styles from './MainImportData.module.scss';
import clsx from 'clsx';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {toastWarn} from '~/common/funcs/toast';
import {checkTime, convertFileSize} from '~/common/funcs/optionConvert';
import Table from '~/components/common/Table';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import companyServices from '~/services/companyServices';
import Noti from '~/components/common/DataWrapper/components/Noti';
import wareServices from '~/services/wareServices';
import Dialog from '~/components/common/Dialog';
import batchBillServices from '~/services/batchBillServices';
import Loading from '~/components/common/Loading';
import DialogWarning from '~/components/common/DialogWarning';
import {PATH} from '~/constants/config';

interface ICustomer {
	code: string;
	name: string;
	status: number;
	typeCus: number;
	uuid: string;
	nameExcel: string;
}

interface IDataExcel {
	Ngày: number;
	Tháng: number;
	Năm: number;
	'Số phiếu': number;
	'Số xe': string;
	'Khách hàng': string;
	Tổng: number;
	'Bì xe': number;
	Tươi: number;
	'Độ khô (%)': number;
	'Lượng TT (Tấn)': number;
	'Ghi chú': string;
	uuid: string;
}

function MainImportData({}: PropsMainImportData) {
	const router = useRouter();

	const [file, setFile] = useState<any>(null);
	const [dragging, setDragging] = useState<boolean>(false);
	const [dataExcel, setDataExcel] = useState<IDataExcel[]>([]);
	const [dataCustomer, setDataCustomer] = useState<ICustomer[]>([]);
	const [form, setForm] = useState<{
		companyUuid: string;
		productTypeUuid: string;
		specificationsUuid: string;
	}>({
		companyUuid: '',
		productTypeUuid: '',
		specificationsUuid: '',
	});
	const [openConfirmName, setOpenConfirmName] = useState<boolean>(false);
	const [openConfirmData, setOpenConfirmData] = useState<boolean>(false);
	const [openWarning, setOpenWarning] = useState<boolean>(false);
	const [listCustomerNotInSystem, setListCustomerNotInSystem] = useState<IDataExcel[]>([]);

	// Xử lý file excel
	const handleDragEnter = (e: any) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		convertData(file);
	};

	const handleFileChange = (e: any) => {
		const file = e.target.files[0];
		convertData(file);
	};

	async function convertData(file: any) {
		try {
			const reader = new FileReader();
			reader.onload = (evt: any) => {
				const bstr = evt.target.result;
				const wb = XLSX.read(bstr, {type: 'binary'});
				const wsname = wb.SheetNames[wb.SheetNames.length - 1]; // Sheet cuối
				const ws = wb.Sheets[wsname];

				// Đọc hàng thứ 4 và hàng thứ 5
				const keysRowIndex = 3; // Hàng thứ 4
				const keysRowIndexFallback = 4; // Hàng thứ 5
				const keys: string[] = [];
				const range = XLSX.utils.decode_range(ws['!ref'] || '');

				// Đọc tất cả các key, gán mặc định là "" nếu không có giá trị
				for (let col = range.s.c; col <= range.e.c; col++) {
					const fallbackCellAddress = XLSX.utils.encode_cell({r: keysRowIndexFallback, c: col});
					const primaryCellAddress = XLSX.utils.encode_cell({r: keysRowIndex, c: col});

					const primaryCell = ws[primaryCellAddress];
					const fallbackCell = ws[fallbackCellAddress];

					// Nếu cả hai hàng đều không có giá trị, gán key mặc định là ""
					const key = (fallbackCell ? fallbackCell.v : primaryCell ? primaryCell.v : '').toString().trim();
					keys.push(key || '');
				}

				// Đọc dữ liệu từ hàng thứ 7 (bỏ qua hàng thứ 6)
				const dataStartRowIndex = 6; // Hàng thứ 7
				const data: any[] = [];
				for (let row = dataStartRowIndex; row <= range.e.r; row++) {
					const rowData: any = {};
					const firstColAddress = XLSX.utils.encode_cell({r: row, c: range.s.c});
					const firstColCell = ws[firstColAddress];

					// Bỏ qua các hàng không có giá trị ở cột đầu tiên
					if (!firstColCell || firstColCell.v === undefined || firstColCell.v === null || firstColCell.v === '') {
						continue;
					}

					// Đọc giá trị các cột còn lại
					for (let col = range.s.c; col <= range.e.c; col++) {
						const cellAddress = XLSX.utils.encode_cell({r: row, c: col});
						const cell = ws[cellAddress];
						rowData[keys[col - range.s.c]] = cell ? cell.v : ''; // Gán "" nếu ô trống
					}
					if (Object.keys(rowData).length > 0) {
						data.push(rowData);
					}
				}

				if (data.length > 0) {
					setFile(file);
					setDataExcel(
						data.map((row) => {
							const {['Độ khô (%)']: doKho, Thu: thu, ...rest} = row;

							return {
								...rest,
								'Độ khô (%)': doKho
									? typeof doKho == 'number'
										? doKho
										: parseFloat(doKho.replace(/\./g, '').replace(',', '.'))
									: 0,
								Tháng: row['Tháng'] || row['Tháng'],
								'Ghi chú': thu || row['Ghi chú'] || row['Thu'],
								uuid: '',
							};
						})
					);
				} else {
					return toastWarn({msg: 'Không có dữ liệu trong file nhập vào!'});
				}
			};
			reader.readAsBinaryString(file);
		} catch (err) {
			return toastWarn({
				msg: 'Không nạp được dữ liệu, vui lòng kiểm tra file đầu vào!',
			});
		}
	}

	// Lấy danh sách công ty
	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
					page: 1,
					pageSize: 200,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Lấy danh sách loại hàng
	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					type: [TYPE_PRODUCT.CONG_TY],
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Lấy danh sách quy cách
	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach, form.productTypeUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
					productTypeUuid: form.productTypeUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.productTypeUuid,
	});

	// Lấy danh sách khách hàng
	useQuery<ICustomer[]>([QUERY_KEY.dropdown_khach_hang, form?.companyUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 200,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: TYPE_CUSTOMER.KH_NHAP,
					provinceId: '',
					specUuid: '',
					companyUuid: form?.companyUuid,
				}),
			}),
		onSuccess(data) {
			setDataCustomer(
				data?.map((v: any) => ({
					...v,
					nameExcel: '',
				}))
			);
		},
		enabled: !!form?.companyUuid,
	});

	const handleConfirmNameExcel = () => {
		const updatedDataExcel = dataExcel.map((row) => {
			const matchedCustomer = dataCustomer.find(
				(customer) => customer?.nameExcel?.trim()?.toLowerCase() === row['Khách hàng']?.trim()?.toLowerCase()
			);

			if (matchedCustomer) {
				return {
					...row,
					uuid: matchedCustomer.uuid,
				};
			}

			return row;
		});

		setDataExcel(updatedDataExcel);
	};

	// Lấy danh sách tên khách hàng đọc từ excel
	const listNameCustomer = useMemo(() => {
		return dataExcel
			?.filter(
				(item, index, array) =>
					array?.findIndex((obj) => obj?.['Khách hàng']?.trim().toLowerCase() === item?.['Khách hàng']?.trim().toLowerCase()) ===
					index
			)
			?.map((v) => v?.['Khách hàng']?.trim());
	}, [dataExcel]);

	// Nhập dữ liệu vào hệ thống
	const funcImportBillExcel = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Nhập dữ liệu thành công!',
				http: batchBillServices.importBillExcel({
					productTypeUuid: form?.productTypeUuid,
					specificationsUuid: form?.specificationsUuid,
					companyUuid: form?.companyUuid,
					lstBills: dataExcel
						?.filter((x) => !!x['uuid'])
						?.map((v) => ({
							codeWs: v['Số phiếu'],
							fromUuid: v['uuid'],
							description: v['Ghi chú'],
							licensePalate: v['Số xe'],
							timeEnd: `${v['Năm']}-${checkTime(v['Tháng'])}-${checkTime(v['Ngày'])}T23:59`,
							timeStart: `${v['Năm']}-${checkTime(v['Tháng'])}-${checkTime(v['Ngày'])}T00:00`,
							weight1: Math.round(v['Tổng'] * 1000),
							weight2: Math.round(v['Bì xe'] * 1000),
							weightReal: Math.round(v['Tươi'] * 1000),
							weightBdmt: Math.round(v['Lượng TT (Tấn)'] * 1000),
							dryness: v['Độ khô (%)'],
						})),
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenConfirmData(false);
				setOpenWarning(false);
				router.push(PATH.PhieuChuaHoanThanh);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	// Xử lý xác nhận dữ liệu
	const handleSubmit = () => {
		if (!form?.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}
		if (!form?.specificationsUuid) {
			return toastWarn({msg: 'Vui lòng chọn quy cách!'});
		}
		if (!form?.companyUuid) {
			return toastWarn({msg: 'Vui lòng chọn KV cảng xuất khẩu!'});
		}
		if (dataExcel?.length == 0) {
			return toastWarn({msg: 'Vui lòng nhập file dữ liệu!'});
		}
		if (dataCustomer?.every((v) => v?.nameExcel) && dataExcel?.every((v) => v['uuid']) == false) {
			setOpenWarning(true);
			setListCustomerNotInSystem(dataExcel?.filter((v) => !v['uuid']));
			return;
		}

		return setOpenConfirmData(true);
	};

	console.log(dataExcel);

	return (
		<div className={styles.container}>
			<Loading loading={funcImportBillExcel?.isLoading} />
			<div className={styles.header}>
				<div className={styles.left}>
					<h4>Nhập dữ liệu từ cảng</h4>
					<p>Điền đầy đủ các thông tin</p>
				</div>
				<div className={styles.right}>
					<Button onClick={() => router.back()} p_10_24 rounded_2 grey_outline>
						Hủy bỏ
					</Button>
					<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
						Lưu lại
					</Button>
				</div>
			</div>

			{/* Chọn loại hàng + quy cách */}
			<div className={clsx('mt', 'col_2')}>
				<Select
					isSearch
					name='productTypeUuid'
					placeholder='Chọn loại hàng'
					value={form?.productTypeUuid}
					label={
						<span>
							Loại hàng <span style={{color: 'red'}}>*</span>
						</span>
					}
				>
					{listProductType?.data?.map((v: any) => (
						<Option
							key={v?.uuid}
							value={v?.uuid}
							title={v?.name}
							onClick={() =>
								setForm((prev: any) => ({
									...prev,
									productTypeUuid: v.uuid,
									specificationsUuid: '',
								}))
							}
						/>
					))}
				</Select>
				<div>
					<Select
						isSearch
						name='specificationsUuid'
						placeholder='Chọn quy cách  '
						value={form?.specificationsUuid}
						label={
							<span>
								Quy cách <span style={{color: 'red'}}>*</span>
							</span>
						}
						readOnly={!form.productTypeUuid}
					>
						{listSpecifications?.data?.map((v: any) => (
							<Option
								key={v?.uuid}
								value={v?.uuid}
								title={v?.name}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										specificationsUuid: v.uuid,
									}))
								}
							/>
						))}
					</Select>
				</div>
			</div>

			{/* Xử lý nhập tên khách hàng để gán uuid */}
			<div className={clsx('mt')}>
				<Select
					isSearch
					name='companyUuid'
					value={form?.companyUuid}
					placeholder='Chọn KV cảng xuất khẩu'
					label={
						<span>
							Thuộc KV cảng xuất khẩu <span style={{color: 'red'}}>*</span>
						</span>
					}
				>
					{listCompany?.data?.map((v: any) => (
						<Option
							key={v?.uuid}
							value={v?.uuid}
							title={v?.name}
							onClick={() =>
								setForm((prev) => ({
									...prev,
									companyUuid: v?.uuid,
								}))
							}
						/>
					))}
				</Select>
			</div>
			{!!form?.companyUuid && (
				<>
					{dataCustomer?.length > 0 ? (
						<>
							<div className={styles.main_assignUuid}>
								{dataCustomer?.map((v) => (
									<div key={v?.uuid} className={styles.assignUuid}>
										<Select
											isSearch
											name={`assignUuid-${v?.uuid}`}
											placeholder='Chọn nhà cung cấp'
											value={v?.uuid}
											label={
												<span>
													Nhà cung cấp <span style={{color: 'red'}}>*</span>
												</span>
											}
											readOnly={true}
										>
											{dataCustomer?.map((v) => (
												<Option key={v?.uuid} value={v?.uuid} title={`${v?.name} - ${v?.code}`} />
											))}
										</Select>
										<div>
											<Select
												isSearch
												name={`nameExcel-${v?.uuid}`}
												placeholder='Chọn tên trong file Excel'
												value={v?.nameExcel}
												label={
													<span>
														Tên trong file Excel <span style={{color: 'red'}}>*</span>
													</span>
												}
												readOnly={listNameCustomer?.length == 0}
												onClean={() =>
													setDataCustomer((prev: ICustomer[]) => {
														return prev.map((customer) =>
															customer.uuid === v?.uuid ? {...customer, nameExcel: ''} : customer
														);
													})
												}
											>
												{listNameCustomer?.map((name, i) => (
													<Option
														key={i}
														value={name}
														title={name}
														onClick={() =>
															setDataCustomer((prev: ICustomer[]) => {
																return prev.map((customer) =>
																	customer.uuid === v?.uuid ? {...customer, nameExcel: name} : customer
																);
															})
														}
													/>
												))}
											</Select>
										</div>
									</div>
								))}
							</div>
							<div className={styles.btn}>
								<div>
									<Button
										// disable={!dataCustomer?.every((v) => v?.nameExcel)}
										p_10_40
										rounded_2
										onClick={() => setOpenConfirmName(true)}
									>
										Xác nhận nhập tên
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className={clsx('mt')}>
							<Noti disableButton title='Khách hàng trống' des='Hiện tại chưa có khách hàng nào thuộc cảng này!' />
						</div>
					)}
				</>
			)}
			<div className={clsx('mt')}>
				{file ? (
					<div className={styles.selectedFile}>
						<div className={styles.file}>
							<div className={styles.icon}>
								<i>
									<Image src={icons.XSL} width={36} height={36} alt='icon xsl' />
								</i>
							</div>
							<div className={styles.info}>
								<p className={styles.name}>{file?.name}</p>
								<p className={styles.size}>{convertFileSize(file?.size / 1000)}</p>
							</div>
							<div>
								<label htmlFor={`file-work`} className={styles.change}>
									<input
										hidden
										id={`file-work`}
										type='file'
										accept='.xls, .xlsx, .csv'
										onClick={(e: any) => {
											e.target.value = null;
										}}
										onChange={handleFileChange}
									/>
									Thay thế
								</label>
								<div
									className={styles.clear}
									onClick={() => {
										setFile(null);
										setDataExcel([]);
										setDataCustomer((prev) =>
											prev?.map((v) => ({
												...v,
												nameExcel: '',
											}))
										);
									}}
								>
									Xóa
								</div>
							</div>
						</div>
					</div>
				) : (
					<label
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
						className={clsx(styles.inputFile, {
							[styles.dragging]: dragging,
						})}
						htmlFor={`file-work`}
					>
						<div className={styles.groupEmpty}>
							<div className={styles.imageEmpty}>
								<Image alt='Image ' width={200} height={150} className={styles.image} src={icons.emptyFileExcel} />
							</div>
							<p>Kéo và thả tệp của bạn vào đây hoặc tải lên</p>
							<a download href='/static/files/FileMauNhapHang.xlsx'>
								Tải file mẫu
							</a>
						</div>
						<input
							hidden
							id={`file-work`}
							type='file'
							accept='.xls, .xlsx, .csv'
							onChange={handleFileChange}
							onClick={(e: any) => {
								e.target.value = null;
							}}
						/>
					</label>
				)}
			</div>

			{/* Table view */}
			<div className={styles.main_table}>
				{dataExcel?.length > 0 && (
					<Table
						fixedHeader={true}
						data={dataExcel || []}
						column={[
							{
								title: 'STT',
								render: (_: IDataExcel, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Ngày',
								render: (data: IDataExcel) => <>{data['Ngày']}</>,
							},
							{
								title: 'Tháng',
								render: (data: IDataExcel) => <>{data['Tháng']}</>,
							},
							{
								title: 'Năm',
								render: (data: IDataExcel) => <>{data['Năm']}</>,
							},
							{
								title: 'Số phiếu',
								render: (data: IDataExcel) => <>{data['Số phiếu']}</>,
							},
							{
								title: 'Số xe',
								render: (data: IDataExcel) => <>{data['Số xe']}</>,
							},
							{
								title: 'Khách hàng',
								render: (data: IDataExcel) => <>{data['Khách hàng']}</>,
							},
							{
								title: 'Tổng',
								render: (data: IDataExcel) => <>{data['Tổng']?.toFixed(2)}</>,
							},
							{
								title: 'Bì xe',
								render: (data: IDataExcel) => <>{data['Bì xe']?.toFixed(2)}</>,
							},
							{
								title: 'Tươi',
								render: (data: IDataExcel) => <>{data['Tươi']?.toFixed(2)}</>,
							},
							{
								title: 'Độ khô (%)',
								render: (data: IDataExcel) => <>{data['Độ khô (%)']?.toFixed(2)}</>,
							},
							{
								title: 'Lượng TT (Tấn)',
								render: (data: IDataExcel) => <>{data['Lượng TT (Tấn)']?.toFixed(2)}</>,
							},
							{
								title: 'Ghi chú',
								render: (data: IDataExcel) => <>{data['Ghi chú'] || '---'}</>,
							},
						]}
					/>
				)}
			</div>

			{/* Xác nhận nhập tên */}
			<Dialog
				warn
				open={openConfirmName}
				title='Xác nhận nhập tên'
				note='Bạn đã chắc chắn tên khách hàng đã chọn đúng với dữ liệu trong hệ thống chưa?'
				onClose={() => {
					setOpenConfirmName(false);
				}}
				onSubmit={() => {
					handleConfirmNameExcel();
					setOpenConfirmName(false);
				}}
			/>

			{/* Xác nhận nhập dữ liệu */}
			<Dialog
				warn
				open={openConfirmData}
				title='Xác nhận dữ liệu'
				note='Bạn đã chắc chắn nhập dữ liệu này vào hệ thống chưa?'
				onClose={() => {
					setOpenConfirmData(false);
				}}
				onSubmit={funcImportBillExcel.mutate}
			/>

			{/* Cảnh báo khách hàng chưa có trong hệ thống */}
			<DialogWarning
				warn
				open={openWarning}
				title='Cảnh báo!'
				note={
					<p>
						Các khách hàng{' '}
						<b>
							{listCustomerNotInSystem
								?.filter(
									(item, index, array) =>
										array?.findIndex((obj) => obj?.['Khách hàng'] === item?.['Khách hàng']) === index
								)
								?.map((v) => v?.['Khách hàng'])
								?.join(', ')}
						</b>{' '}
						chưa nằm trong hệ thống.
						<br />
						Bạn có chắc chắn muốn nhập dữ liệu!
					</p>
				}
				onClose={() => setOpenWarning(false)}
				onSubmit={funcImportBillExcel.mutate}
			/>
		</div>
	);
}

export default MainImportData;
