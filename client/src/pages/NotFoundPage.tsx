import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2>Сторінку не знайдено</h2>
      <p>
        <Link to="/users">До списку користувачів</Link>
      </p>
    </div>
  );
};
