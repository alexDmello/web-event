import React from 'react';
import styles from './PageBanner.module.css';

interface PageBannerProps {
  title: string;
  description: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({ title, description }) => {
  return (
    <section className={styles.pageBanner}>
      <h1>{title}</h1>
      <div className={styles.pageBannerDiamond}></div>
      <p>{description}</p>
    </section>
  );
};
