import React from "react";
import { DepartmentsIcon, PeoplesIcon, QuestionsIcon } from './icons';
import styles from '../styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.navIcon}>
        <DepartmentsIcon />
      </div>
      <div className={styles.navIcon}>
        <PeoplesIcon />
      </div>
      <div className={styles.navIcon}>
        <QuestionsIcon />
      </div>
    </footer>
  );
}