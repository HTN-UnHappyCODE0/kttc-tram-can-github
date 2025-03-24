import React, {useContext, useEffect, useState} from 'react';

import {PropsTextArea} from './interfaces';
import styles from './TextArea.module.scss';
import {ContextData} from '../Input/interfaces';
import {FormContext} from '../../contexts';
import clsx from 'clsx';

function TextArea({placeholder, name, isRequired = false, textRequired, max, min, label, blur, showDone, readOnly = false}: PropsTextArea) {
	const data = useContext<ContextData>(FormContext);

	const [isFocus, setIsFocus] = useState<boolean>(false);

	/********** Xử lí khi submit, kiểm tra validate input **********/
	useEffect(() => {
		if (data.countValidate > 0) {
			handleSetMessage();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.countValidate]);

	/********** Xử lí khi value input thay đổi, kiểm tra validate input **********/
	useEffect(() => {
		data.setValidate((prev: any) => ({
			...prev,
			[name]: handleValidate(),
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.form]);

	/********** Hiển thị message thông báo validate **********/
	const handleSetMessage = () => {
		data.setErrorText((prev: any) => ({
			...prev,
			[name]: null,
		}));

		if ((isRequired && `${data.form[name]}`.trim() === '') || (!data.form[name] && isRequired)) {
			return data.setErrorText((prev: any) => ({
				...prev,
				[name]: textRequired || 'Vui lòng nhập trường này',
			}));
		}
		if (!!data.form[name] && `${data.form[name]}`.trim() !== '') {
			if (max && `${data.form[name]}`.trim().length > Number(max)) {
				return data.setErrorText((prev: any) => ({
					...prev,
					[name]: `Nhập tối đa ${max} kí tự`,
				}));
			}

			if (min && `${data.form[name]}`.trim().length < Number(min)) {
				return data.setErrorText((prev: any) => ({
					...prev,
					[name]: `Nhập tối thiểu ${min} kí tự`,
				}));
			}
		}
	};

	/********** Check validate **********/
	const handleValidate = () => {
		if ((isRequired && `${data.form[name]}`.trim() === '') || (!data.form[name] && isRequired)) {
			return false;
		}

		if (!!data.form[name] && `${data.form[name]}`.trim() !== '') {
			if (max && `${data.form[name]}`.trim().length > Number(max)) {
				return false;
			}

			if (min && `${data.form[name]}`.trim().length < Number(min)) {
				return false;
			}
		}
		return true;
	};

	const handleChange = (e: any) => {
		const {value, name} = e.target;

		return data.setForm((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlerFocused = () => {
		setIsFocus(true);
		data.setErrorText((prev: any) => ({
			...prev,
			[name]: null,
		}));
	};

	const handlerBlur = () => {
		setIsFocus(false);
		if (blur) {
			handleSetMessage();
			/********** return validate passed **********/
			return data.setValidate((prev: any) => ({
				...prev,
				[name]: handleValidate(),
			}));
		}
	};

	return (
		<div className={styles.container}>
			{label ? <label className={styles.label}>{label}</label> : null}
			<textarea
				className={clsx(styles.textarea, {
					[styles.focus]: isFocus,
					[styles.done]: showDone && data.isDone,
					[styles.error]: data?.errorText[name] !== null,
					[styles.readOnly]: readOnly,
				})}
				placeholder={placeholder}
				onFocus={handlerFocused}
				onChange={handleChange}
				onBlur={handlerBlur}
				name={name}
				value={`${data.form[name]}`}
				autoComplete='off'
				readOnly={readOnly}
			/>
			<p className={styles.errorText}>{data?.errorText[name]}</p>
		</div>
	);
}

export default TextArea;
