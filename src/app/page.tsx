import Image from "next/image";
import React from "react";
import { PeoplesIcon, DepartmentsIcon, QuestionsIcon, ProfileIcon } from "./icons";

export default function Home() {
  return (
    <div className="main-container">
      <header className="header">
        <div className="settings-icon">
          <span>⚙️</span>
        </div>
        <h1 className="page-title">Ana Sayfa</h1>
        <div className="profile-container">
          <ProfileIcon
            width={40}
            height={40}
            className="profile-image"
          />
        </div>
      </header>

      <main className="body">
        <div className="card-container">
          <div className="card">
            <div className="card-content">
              {/* Card Label - Sol Üst */}
              <div className="card-label card-label-positioned">
                Denetimler
              </div>
              
              {/* Circular Progress - Sağ Üst */}
              <div className="circular-progress circular-progress-positioned">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255, 248, 225, 0.5)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#FFF8E1"
                    strokeWidth="10"
                    strokeDasharray="251.3"
                    strokeDashoffset="75.4"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dy=".3em"
                    className="circular-progress-text"
                  >
                    70%
                  </text>
                </svg>
              </div>
              
              {/* Add Button - Sağ Alt */}
              <div className="add-button add-button-positioned">
                +
              </div>
              
              {/* All Button - Sol Orta */}
              <div className="all-button all-button-positioned">
                Tümü
              </div>
              
              {/* Progress Bar - Sol Alt */}
              <div className="progress-container">
                <div className="progress-bar-label">Güncel</div>
                <div className="progress-wrapper">
                  <div className="progress-bar progress-bar-sized">
                    <div className="progress-fill progress-fill-percentage"></div>
                  </div>
                  <span className="progress-text">70%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="nav-icon">
          <DepartmentsIcon />
        </div>
        <div className="nav-icon">
          <PeoplesIcon
            width={24}
            height={24}
            style={{color:"white"}}
          />
        </div>

        <div className="nav-icon">
          <QuestionsIcon
            width={24}
            height={24}
          />
        </div>
      </footer>
    </div>
  );

  
}
