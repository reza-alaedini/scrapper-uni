import { useEffect, useMemo, useState } from "react";
import styles from "../css/styles.module.css";

const phases = [
  {
    title: "درخواست جست‌وجو ثبت شد",
    detail: "فیلترها برای crawler آماده شدند.",
  },
  {
    title: "در حال بررسی صفحه‌های دیوار",
    detail: "صفحه‌های مرتبط یکی‌یکی خوانده می‌شوند.",
  },
  {
    title: "در حال تطبیق آگهی‌ها",
    detail: "دسته، شهر و بازه قیمت کنترل می‌شوند.",
  },
  {
    title: "در حال آماده‌سازی نتیجه‌ها",
    detail: "جست‌وجو ادامه دارد؛ این صفحه را باز نگه دارید.",
  },
];

const SearchProgress = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activePhase = useMemo(
    () => Math.min(Math.floor(elapsed / 7), phases.length - 1),
    [elapsed],
  );

  const timeLabel = new Intl.NumberFormat("fa-IR", {
    minimumIntegerDigits: 2,
  }).format(elapsed);

  return (
    <div className={styles.progressPanel} role="status" aria-live="polite">
      <div className={styles.progressHeader}>
        <div>
          <span className={styles.liveStatus}>
            <i aria-hidden="true" />
            جست‌وجو در حال اجراست
          </span>
          <h2>{phases[activePhase].title}</h2>
          <p>{phases[activePhase].detail}</p>
        </div>
        <div className={styles.elapsedTime} aria-label={`${elapsed} ثانیه سپری شده`}>
          <span>{timeLabel}</span>
          <small>ثانیه</small>
        </div>
      </div>

      <div className={styles.crawlScene} aria-hidden="true">
        <div className={styles.sourceStack}>
          <span className={styles.sceneLabel}>صفحه‌های دیوار</span>
          {[0, 1, 2].map((item) => (
            <div key={item} className={styles.sourcePage}>
              <i />
              <span>
                <b />
                <b />
              </span>
            </div>
          ))}
        </div>
        <div className={styles.crawlTrack}>
          <span className={styles.packet} />
          <svg viewBox="0 0 90 20">
            <path d="M2 10h82" />
            <path d="m78 4 8 6-8 6" />
          </svg>
          <span className={styles.crawlerBadge}>
            <svg viewBox="0 0 24 24">
              <path d="M8 9h8a3 3 0 0 1 3 3v5H5v-5a3 3 0 0 1 3-3Z" />
              <path d="M9 9V6m6 3V6M8 21v-4m8 4v-4M9 13h.1M15 13h.1" />
            </svg>
          </span>
        </div>
        <div className={styles.resultStack}>
          <span className={styles.sceneLabel}>نتیجه‌های منطبق</span>
          <div className={styles.resultPage}>
            <i />
            <span><b /><b /><b /></span>
          </div>
          <div className={styles.resultPage}>
            <i />
            <span><b /><b /><b /></span>
          </div>
        </div>
      </div>

      <div className={styles.indeterminateTrack} aria-hidden="true">
        <span />
      </div>

      <ol className={styles.progressSteps}>
        {phases.map((phase, index) => {
          const state = index < activePhase ? "done" : index === activePhase ? "active" : "pending";
          return (
            <li key={phase.title} className={styles[state]}>
              <span className={styles.stepMarker} aria-hidden="true">
                {state === "done" ? (
                  <svg viewBox="0 0 20 20"><path d="m5 10 3 3 7-7" /></svg>
                ) : (
                  <i />
                )}
              </span>
              <span>{phase.title}</span>
            </li>
          );
        })}
      </ol>

      <p className={styles.progressNote}>
        مدت جست‌وجو به تعداد صفحه‌ها و پاسخ‌گویی دیوار بستگی دارد و ممکن است چند
        دقیقه طول بکشد.
      </p>
    </div>
  );
};

export default SearchProgress;
