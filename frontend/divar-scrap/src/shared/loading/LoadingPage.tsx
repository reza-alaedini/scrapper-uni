import styles from "./styles.module.css";

type loading = "primary";

const LoadingPage = ({
  type = "primary",
  opacity = false,
  className
}: {
  type?: loading;
  opacity?: boolean;
  className?:string
}) => {
  return (
    <div className={`${styles.loadingContainer} ${className} ${opacity?styles.opacity:""}`}>
      <span className={`${styles.loadingSpinner} ${styles[type]}`} />
    </div>
  );
};

export default LoadingPage;
