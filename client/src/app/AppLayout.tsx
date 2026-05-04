import { NavLink, Outlet } from "react-router-dom";
import { Toaster } from "@/components/Toaster";

export const AppLayout = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">Керування користувачами</div>
        <nav className="app-nav">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
            }
          >
            Користувачі
          </NavLink>
          <NavLink
            to="/departments"
            className={({ isActive }) =>
              isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
            }
          >
            Підрозділи
          </NavLink>
          <NavLink
            to="/service-records"
            className={({ isActive }) =>
              isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
            }
          >
            Службові записи
          </NavLink>
          <NavLink
            to="/users-demo"
            className={({ isActive }) =>
              isActive ? "app-nav__link app-nav__link--active" : "app-nav__link"
            }
          >
            Демо стану
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};
