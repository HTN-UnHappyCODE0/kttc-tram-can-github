import Head from "next/head";
import React, { Fragment } from "react";

import { PATH } from "~/constants/config";
import Button from "~/components/common/Button";
import ImageFill from "~/components/common/ImageFill";
import background from "~/constants/images/background";

import styles from "./Page502.module.scss";

function PageError() {
  return (
    <Fragment>
      <Head>
        <title>Page 502</title>
        <meta name="description" content="Page 502" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div>
          <ImageFill src={background.image502} className={styles.image} />
        </div>
        <h4 className={styles.title}>Oops! Lỗi máy chủ nội bộ..</h4>
        <p className={styles.text}>
          Xin lỗi! Hiện tại máy chủ đang gặp sự cố. Bạn vui lòng chờ trong giây
          lát hoặc thử lại sau.
        </p>
        <div className={styles.btn}>
          <Button href={PATH.Home} primary rounded_2 p_12_32 size_bold bold>
            Quay về trang chủ
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default PageError;
