import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { CardAksiyonlarMain } from "../../components/card_aksiyonlar";
import styles from "../../styles/layout.module.css";
import allDenetimlerStyles from "../../styles/all-denetimler.module.css";

export default function AllDenetimler() {
  return (
    <div className={styles.mainContainer}>
      <Header />

      <main className={styles.body}>
        <div className={allDenetimlerStyles.pageHeader}>
          <h1 className={allDenetimlerStyles.pageTitle}>Tüm Denetimler</h1>
          <p className={allDenetimlerStyles.pageDescription}>
            Sistemdeki tüm denetim kayıtlarını görüntüleyebilir ve yönetebilirsiniz.
          </p>
        </div>
        <CardAksiyonlarMain />
      </main>

      <Footer />
    </div>
  );
}