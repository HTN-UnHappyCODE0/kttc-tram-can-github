import Head from "next/head";
import React, { Fragment } from "react";

import { PATH } from "~/constants/config";
import Button from "~/components/common/Button";
import ImageFill from "~/components/common/ImageFill";
import background from "~/constants/images/background";

import styles from "./Page404.module.scss";

function PageNotFound() {
  return (
    <Fragment>
      <Head>
        <title>Page 404</title>
        <meta name="description" content="Page 404" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div>
          <ImageFill src={background.image404} className={styles.image} />
        </div>
        <h4 className={styles.title}>Oops! Không tìm thấy trang.</h4>
        <p className={styles.text}>
          Xin lỗi! Trang bạn đang tìm không tồn tại. Nếu bạn cho rằng có gì đó
          bị hỏng, hãy báo cáo sự cố cho đội ngũ kỹ thuật.
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

export default PageNotFound;
