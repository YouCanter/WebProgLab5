import { Toaster } from "@/components/Toaster";
import { UsersPage } from "@/pages/users/UsersPage";

export const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">Користувачі — Redux Toolkit</div>
        <span className="app-header__hint">Практична робота 06 · Redux store + persistence</span>
      </header>
      <main className="app-main">
        <UsersPage />
      </main>
      <Toaster />
    </div>
  );
};
