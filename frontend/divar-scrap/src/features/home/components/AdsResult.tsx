import type { FC } from "react";
import type { IAd } from "../types/home";
import { numberSeparate } from "@/utils/utils";
import ImageLazy from "@/shared/components/imageLazy/ImageLazy";
import styles from "../css/styles.module.css";

interface IProps {
  data: IAd[];
}

const AdsResult: FC<IProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className={styles.feedbackState} role="status">
        <span className={styles.feedbackIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5M8 10.5h5" />
          </svg>
        </span>
        <h2>آگهی منطبقی پیدا نشد</h2>
        <p>بازه قیمت را بازتر کنید یا دسته و شهر دیگری را امتحان کنید.</p>
      </div>
    );
  }

  return (
    <div className={styles.resultsSection}>
      <div className={styles.resultsHeader}>
        <div>
          <h2>آگهی‌های پیدا شده</h2>
          <p>نتیجه‌ها بر اساس فیلترهای انتخابی شما جمع‌آوری شده‌اند.</p>
        </div>
        <span>{new Intl.NumberFormat("fa-IR").format(data.length)} آگهی</span>
      </div>
      <div className={styles.adsContainer}>
        {data.map((ad, index) => (
          <a
            key={`${ad.link}-${index}`}
            className={styles.adCard}
            href={ad.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`مشاهده آگهی ${ad.title} در پنجره جدید`}
          >
            <div className={styles.adImageContainer}>
              <ImageLazy
                src={ad.image_url}
                alt={`تصویر آگهی ${ad.title}`}
                type="fade"
                loading="lazy"
              />
            </div>
            <div className={styles.adInfoContainer}>
              <h3 className={styles.adTitle}>{ad.title}</h3>
              <div className={styles.adInfo}>
                <span className={styles.adPrice}>
                  {numberSeparate(ad.price)} تومان
                </span>
                <span className={styles.adLinkBtn}>
                  مشاهده در دیوار
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdsResult;
