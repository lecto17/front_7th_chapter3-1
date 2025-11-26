import React from "react";
import { Header } from "./components/organisms";
import { ManagementPage } from "./pages/ManagementPage";
import "./index.css";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ManagementPage />
      </main>
    </div>
  );
};
