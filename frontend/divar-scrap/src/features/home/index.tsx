import { useEffect, useRef } from "react";
import AdsResult from "./components/AdsResult";
import SearchForm from "./components/SearchForm";
import SearchProgress from "./components/SearchProgress";
import { useLanding } from "./services/useLanding";
import { cleanObject } from "@/utils/utils";
import styles from "./css/styles.module.css";
import ImageLazy from "@/shared/components/imageLazy/ImageLazy";

const Home = () => {
  const resultsRef = useRef<HTMLElement>(null);
  const { mutate, isLoading, isError, data, variables } =
    useLanding().useIndexAds();

  const handleSearchForm = (formData: Record<string, unknown>) => {
    mutate(cleanObject({ ...formData }));
  };

  const handleRetry = () => {
    if (variables) mutate(variables);
  };

  useEffect(() => {
    if ((data || isError) && window.matchMedia("(max-width: 767px)").matches) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data, isError]);

  return (
    <div className={styles.container} dir="rtl">
      <a className={styles.skipLink} href="#search-form">
        رفتن به فرم جست‌وجو
      </a>

      <header className={styles.siteHeader}>
        <div className={styles.navContent}>
          <a className={styles.brand} href="#top" aria-label="صفحه اصلی جست‌وجوی آگهی">
            <span className={styles.brandMark} aria-hidden="true">
              <ImageLazy needAssetUrl={false} src="./vite.svg" type="fade" alt="" />
            </span>
            <span>جست‌وجوی پیشرفته آگهی</span>
          </a>
        </div>
      </header>

      <main id="top" className={styles.page}>
        <section className={styles.hero} aria-labelledby="page-title">
          <div className={styles.heroCopy}>
            <h1 id="page-title">آگهی‌های دیوار را دقیق‌تر پیدا کنید.</h1>
            <p>
              دسته، شهر و بودجه را مشخص کنید؛ ما صفحه‌های مرتبط را بررسی می‌کنیم
              و نتیجه‌های منطبق را یک‌جا نشان می‌دهیم.
            </p>
          </div>
          <div className={styles.flow} aria-label="مسیر جست‌وجو">
            <span>تنظیم فیلتر</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
            <span>بررسی دیوار</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
            <span>نمایش نتیجه</span>
          </div>
        </section>

        <div className={styles.searchLayout}>
          <aside className={styles.filterColumn} aria-label="فیلترهای جست‌وجو">
            <SearchForm onSubmit={handleSearchForm} isLoading={isLoading} />
          </aside>

          <section
            ref={resultsRef}
            className={styles.resultsColumn}
            aria-label="وضعیت و نتیجه جست‌وجو"
          >
            {isLoading ? (
              <SearchProgress />
            ) : isError ? (
              <div className={styles.feedbackState} role="alert">
                <span className={styles.feedbackIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 8v5" />
                    <path d="M12 17.2v.1" />
                    <path d="M10.3 4.7 3.2 17a2 2 0 0 0 1.7 3h14.2a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z" />
                  </svg>
                </span>
                <h2>جست‌وجو کامل نشد</h2>
                <p>
                  ارتباط با سرویس یا دیوار قطع شده است. اتصال اینترنت را بررسی
                  کنید و دوباره تلاش کنید.
                </p>
                <button type="button" onClick={handleRetry} disabled={!variables}>
                  تلاش دوباره
                </button>
              </div>
            ) : data ? (
              <AdsResult data={data} />
            ) : (
              <div className={styles.idleState}>
                <div className={styles.idleVisual} aria-hidden="true">
                  <div className={styles.idleSheet}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.idleLens}>
                    <svg viewBox="0 0 32 32">
                      <circle cx="13" cy="13" r="8" />
                      <path d="m19 19 8 8" />
                    </svg>
                  </div>
                </div>
                <h2>جست‌وجوی شما از اینجا شروع می‌شود</h2>
                <p>
                  فیلترها را انتخاب کنید. هنگام بررسی آگهی‌ها، مرحله‌ای که crawler
                  در آن قرار دارد همین‌جا نمایش داده می‌شود.
                </p>
                <ul>
                  <li>بررسی صفحه‌های مرتبط</li>
                  <li>جمع‌آوری آگهی‌های منطبق</li>
                  <li>آماده‌سازی نتیجه‌ها برای مقایسه</li>
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
