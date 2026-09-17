import styles from "./styles.module.css";

export type ILoading = "white" | "green" | "black";
const LoadingDot = ({
  type = "white",
  size,
}: {
  type?: ILoading;
  size?: string;
}) => {
  return (
    <div className={`${styles.loading} ${styles[type]}`}>
      {Array.from({ length: 3 }, (_, index) => (
        <span style={{ width: size, height: size }} key={index} />
      ))}
    </div>
  );
};

export default LoadingDot;
