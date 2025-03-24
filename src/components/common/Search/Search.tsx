import {useState, useRef} from 'react';
import {PropsSearch} from './interfaces';
import {GrSearch} from 'react-icons/gr';
import clsx from 'clsx';
import styles from './Search.module.scss';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

function Search({placeholder = 'Nhập từ khoá tìm kiếm', keyName = '_q', type = 'text', data, onSetData}: PropsSearch) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const {replace} = useRouter();

	const [isFocus, setIsFocus] = useState(false);
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	const handleSearch = (term: string) => {
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

		debounceTimeout.current = setTimeout(() => {
			const params = new URLSearchParams(Array.from(searchParams.entries()));

			if (term) {
				params.set(keyName, term);
			} else {
				params.delete(keyName);
			}
			replace(`${pathname}?${params.toString()}`);
		}, 700);
	};

	return (
		<div className={clsx(styles.container, {[styles.focus]: isFocus})}>
			<div className={styles.icon}>
				<GrSearch color='#3f4752' size={20} />
			</div>
			<input
				type={type}
				placeholder={placeholder}
				onFocus={() => setIsFocus(true)}
				onBlur={() => setIsFocus(false)}
				onChange={(e) => {
					if (onSetData) {
						onSetData(e.target.value);
					} else {
						handleSearch(e.target.value);
					}
				}}
				defaultValue={data || (searchParams.get(keyName) ?? '')}
			/>
		</div>
	);
}

export default Search;
