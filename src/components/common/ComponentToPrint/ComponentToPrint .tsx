// import React, {ForwardedRef} from 'react';
// import styles from './ComponentToPrint.module.scss';
// import {PropsComponentToPrint} from './interfaces';

// const ComponentToPrint = React.forwardRef<HTMLDivElement, PropsComponentToPrint>((props, ref: ForwardedRef<HTMLDivElement>) => {
// 	const {children, ...rest} = props;

// 	return (
// 		<div ref={ref} {...rest} className={styles.container}>
// 			{children || 'My cool content here!'}
// 		</div>
// 	);
// });

// // Adding a display name for better debugging
// ComponentToPrint.displayName = 'ComponentToPrint';

// export default ComponentToPrint;
import React, {forwardRef, Fragment} from 'react';
import styles from './ComponentToPrint.module.scss';
import {PropsComponentToPrint} from './interfaces';

import icons from '~/constants/images/icons';
import ImageFill from '../ImageFill/ImageFill';
import Image from 'next/image';

const ComponentToPrint = forwardRef<HTMLDivElement, PropsComponentToPrint>(({data, columns}, ref) => {
	return (
		<Fragment>
			<div ref={ref} className={styles.container}>
				<div className={styles.watermark_logo}>
					<div className={styles.logo_mark}>
						<Image src={icons.mark_logo} className={styles.logo_mark_icon} alt='Logo' />
					</div>
				</div>
				<div className={styles.invoice_container}>
					<div className={styles.invoice_header}>
						<div>
							<h1>Công nợ</h1>
							<p>8/9/2024</p>
						</div>
						<div className={styles.logo_content}>
							<ImageFill src={icons.logo} className={styles.logo_icon} alt='Logo' />
							<h4 className={styles.title_logo}>Thái hưng</h4>
						</div>
					</div>

					<div className={styles.compan_info}>
						<p>
							<b>Onedoc, Inc</b>
						</p>
						<p>1600 Pennsylvania Avenue NW,</p>
						<p>Washington,</p>
						<p>DC 20500,</p>
						<p>United States of America</p>
					</div>

					<div className={styles.divider}></div>

					<div className={styles.bill_to}>
						<p>
							<b>Bill to:</b>
						</p>
						<p>Titouan LAUNAY</p>
						<p>72 Faxcol Dr Gotahm City,</p>
						<p>NJ 12345,</p>
						<p>United States of America</p>
					</div>

					<div className={styles.divider}></div>

					<p className={styles.invoice_note}>
						All items below correspond to work completed in the month of January 2024. Payment is due within 15 days of receipt
						of this invoice.
					</p>

					<table>
						<thead>
							<tr>
								{columns.map((col, index) => (
									<th key={index}>{col.title}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.map((item, index) => (
								<tr key={index}>
									{columns.map((col, colIndex) => (
										<td key={colIndex}>{col.render(item)}</td>
									))}
								</tr>
							))}
							{data.map((item, index) => (
								<tr key={index}>
									{columns.map((col, colIndex) => (
										<td key={colIndex}>{col.render(item)}</td>
									))}
								</tr>
							))}
							{data.map((item, index) => (
								<tr key={index}>
									{columns.map((col, colIndex) => (
										<td key={colIndex}>{col.render(item)}</td>
									))}
								</tr>
							))}
							{data.map((item, index) => (
								<tr key={index}>
									{columns.map((col, colIndex) => (
										<td key={colIndex}>{col.render(item)}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
					<div className={styles.page_number}></div>
				</div>
			</div>
		</Fragment>
	);
});

ComponentToPrint.displayName = 'ComponentToPrint';

export default ComponentToPrint;
