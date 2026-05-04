import { UsersProvider } from "@/state/users/UsersContext";
import { DemoPagination } from "./components/DemoPagination";
import { FilterPanel } from "./components/FilterPanel";
import { StatusCard } from "./components/StatusCard";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";

const DemoHeader = () => (
  <header className="demo-page-header card">
    <div className="demo-page-header__intro">
      <div className="demo-page-header__eyebrow">ПРАКТИЧНА РОБОТА 05</div>
      <h1 className="demo-page-header__title">
        Керування користувацькими даними та станом інтерфейсу
      </h1>
      <p className="demo-page-header__lead">
        Референсний інтерфейс демонструє, як компоненти подання працюють через hook
        координації, окремий рівень стану та модуль доступу до даних.
      </p>
    </div>
    <StatusCard />
  </header>
);

export const UsersDemoPage = () => {
  return (
    <UsersProvider>
      <div className="users-demo">
        <DemoHeader />
        <FilterPanel />
        <div className="demo-grid">
          <UserList />
          <UserForm />
        </div>
        <DemoPagination />
      </div>
    </UsersProvider>
  );
};
