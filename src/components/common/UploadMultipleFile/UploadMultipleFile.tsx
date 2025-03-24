import React from 'react';

import {PropsUploadMultipleFile} from './interfaces';
import styles from './UploadMultipleFile.module.scss';
import Image from 'next/image';
import {IoClose} from 'react-icons/io5';
import {AddCircle} from 'iconsax-react';
import clsx from 'clsx';

function UploadMultipleFile({images = [], setImages, disnable}: PropsUploadMultipleFile) {
	const handleFileChange = (event: any) => {
		const files = event.target.files;
		const newImages: any = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const url = URL.createObjectURL(file);
			newImages.push({url, file});
		}

		setImages((prevImages: any) => [...prevImages, ...newImages]);
	};

	const handleDelete = (index: number) => {
		setImages((prevImages: any) => {
			URL.revokeObjectURL(prevImages[index].url);
			return [...prevImages.slice(0, index), ...prevImages.slice(index + 1)];
		});
	};

	return (
		<div className={styles.main_upload}>
			{images?.length > 0 && (
				<div className={styles.list_image}>
					{images.map((image, index) => (
						<div className={styles.box_image} key={index}>
							<Image className={styles.image} src={image?.url || image?.path} alt='image' objectFit='cover' layout='fill' />
							{!disnable && (
								<div className={clsx(styles.delete)} onClick={() => handleDelete(index)}>
									<IoClose size={14} color='#8496AC' />
								</div>
							)}
						</div>
					))}
				</div>
			)}
			{!disnable && (
				<div className={styles.upload}>
					<label className={styles.input_upload}>
						<AddCircle color='rgba(198, 201, 206, 1)' />
						<input
							hidden
							type='file'
							multiple
							accept='image/png, image/gif, image/jpeg'
							onClick={(e: any) => {
								e.target.value = null;
							}}
							onChange={handleFileChange}
						/>
					</label>

					<div className={styles.note_upload}>
						<p>Upload file</p>
						<p>File không vượt quá 50MB</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default UploadMultipleFile;
