import styles from './component-with-img.module.scss';

interface ComponentWithImgProps {
  img: string;
  title: string;
  text: string;
}

function ComponentWithImg({ img, title, text }: ComponentWithImgProps) {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={`src/shared/assets/img/${img}`} alt="картинка-заглушка" />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default ComponentWithImg;
