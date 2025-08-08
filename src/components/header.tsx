import React, { memo } from "react";
import { ProfileIcon } from "./icons";
import styles from '../styles/header.module.css';

const Header = memo(function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.settingsIcon}>
        <span>⚙️</span>
      </div>
      <h1 className={styles.pageTitle}>Hoş geldin</h1>
      <div className={styles.profileContainer}>
        <ProfileIcon
          width={40}
          height={40}
          className={styles.profileImage}
        />
      </div>
    </header>
  );
});

export default Header;