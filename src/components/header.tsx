import React from "react";
import { ProfileIcon } from "./icons";
import styles from '../styles/header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.settingsIcon}>
        <span>⚙️</span>
      </div>
      <h1 className={styles.pageTitle}>Ana Sayfa</h1>
      <div className={styles.profileContainer}>
        <ProfileIcon
          width={40}
          height={40}
          className={styles.profileImage}
        />
      </div>
    </header>
  );
}