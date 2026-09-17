import styles from "./css/styles.module.css";
// components
import SearchForm from "./components/SearchForm";
// hooks
import { useLanding } from "./services/useLanding";
import { cleanObject } from "@/utils/utils";
import AdsResult from "./components/AdsResult";
import { useEffect, useRef } from "react";

const Home = () => {
  const resultsRef = useRef<HTMLDivElement>(null);

  // services
  const { mutate, isLoading, data } = useLanding().useIndexAds();

  const handleSearchForm = (formData: any) => {
    mutate(cleanObject({ ...formData }));
  };

  useEffect(() => {
    if (data && data.length > 0) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>جستجوی پیشرفته</h1>
        <p className={styles.subtitle}>
          محصول یا ملک مورد نظر خود را پیدا کنید
        </p>
      </header>
      <SearchForm onSubmit={handleSearchForm} isLoading={isLoading} />
      <div
        style={{ marginTop: "1rem", scrollMarginTop: "20px" }}
        ref={resultsRef}
      >
        <AdsResult data={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Home;
