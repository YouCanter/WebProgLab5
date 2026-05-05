import { Toaster } from "@/components/Toaster";
import { UsersPage } from "@/pages/users/UsersPage";

export const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">Користувачі — Redux Toolkit</div>
      </header>
      <main className="app-main">
        <UsersPage />
      </main>
      <Toaster />
    </div>
  );
};
