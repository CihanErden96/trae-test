import React, { Suspense } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import CardDenetimler from "../components/card_denetimler";
import { CardAksiyonlarMain } from "../components/card_aksiyonlar";
import { CardDenetimDepartman } from "../components/card_denetim";
import styles from "../styles/layout.module.css";

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <Header />

      <main className={styles.body}>
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <CardDenetimler />
          <CardAksiyonlarMain />
          <CardDenetimDepartman />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
