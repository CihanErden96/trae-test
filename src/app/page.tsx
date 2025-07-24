import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import CardDenetimler from "../components/card_denetimler";
import styles from "../styles/layout.module.css";

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <Header />

      <main className={styles.body}>
        <CardDenetimler />
      </main>

      <Footer />
    </div>
  );
}
