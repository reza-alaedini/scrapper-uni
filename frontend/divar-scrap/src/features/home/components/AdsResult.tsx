import type { FC } from "react";
import styles from "../css/styles.module.css";
// types
import type { IAd } from "../types/home";
import { numberSeparate } from "@/utils/utils";
// components
import ImageLazy from "@/shared/components/imageLazy/ImageLazy";

interface IProps {
  data: IAd[] | undefined;
  isLoading?: boolean;
}

const AdsResult: FC<IProps> = ({ data, isLoading = false }) => {
  const handleOpenLink = (link: string) => {
    window.open(link, "_blank");
  };

  if (typeof data === "undefined") return null;
  return (
    <>
      {data && data?.length >= 1 && !isLoading ? (
        <div className={styles.adsContainer}>
          {data?.map((ad, index) => (
            <div key={index} className={styles.adCard}>
              <div className={styles.adImageContainer}>
                <ImageLazy src={ad?.image_url} alt="ad-image" type="fade" />
              </div>
              <div className={styles.adInfoContainer}>
                <span className={styles.adTitle}>{ad?.title}</span>
                <div className={styles.adInfo}>
                  <span className={styles.adPrice}>
                    {numberSeparate(ad?.price)} تومان
                  </span>
                  <span
                    className={styles.adLinkBtn}
                    onClick={() => handleOpenLink(ad?.link)}
                  >
                    مشاهده آگهی
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyAdsTxt}>آگهی مورد نظر یافت نشد!</div>
      )}
    </>
  );
};

export default AdsResult;
