import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import CardDenetimler from "../components/card_denetimler";
import { CardAksiyonlarMain } from "../components/card_aksiyonlar";
import styles from "../styles/layout.module.css";

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <Header />

      <main className={styles.body}>
        <CardDenetimler />
        <CardAksiyonlarMain />
      </main>

      <Footer />
    </div>
  );
}
