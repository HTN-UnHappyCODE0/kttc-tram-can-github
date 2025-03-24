import React, {ForwardedRef} from 'react';
import styles from '@/styles/Home.module.css';

type TableRow = {
	col1: string;
	col2: string;
	col3: string;
};

interface PrintFileProps {
	tableData: TableRow[];
}

const PrintFile = React.forwardRef<HTMLDivElement, PrintFileProps>(({tableData}, ref: ForwardedRef<HTMLDivElement>) => {
	return (
		<div ref={ref} className={styles.printSection}>
			<h1>Đây là nội dung sẽ được in</h1>
			<p>Nội dung có thể là bất cứ thứ gì bạn muốn.</p>
			<div>
				<table>
					<thead>
						<tr>
							<th>Tiêu đề 1</th>
							<th>Tiêu đề 2</th>
							<th>Tiêu đề 3</th>
						</tr>
					</thead>
					<tbody>
						{tableData.map((row, index) => (
							<tr key={index}>
								<td>{row.col1}</td>
								<td>{row.col2}</td>
								<td>{row.col3}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
});

PrintFile.displayName = 'PrintFile';

export default PrintFile;
