import { useState } from "react";
import Header from "./components/Header/Header";
import Reports from "./components/Reports/Reports";
import Sections from "./components/Sections/Sections";
import { DASHBOARD_SECTION } from "./domain/section";
import Charts from "./components/Charts/Charts";
import Sells from "./components/Sells/Sells";
import Products from "./components/Products/Products";

const today = new Date();

export default function Dashboard() {
  const [section, setSection] = useState(DASHBOARD_SECTION.PRODUCTS);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  return (
    <div className="bg-gray-50 w-full min-h-dvh flex flex-col items-center px-5 py-5">
      <main className="w-full max-w-[1200px] flex flex-col">
        <Header
          month={{ onChange: setMonth, value: month }}
          year={{ onChange: setYear, value: year }}
        />

        <Reports />

        <Sections onChange={setSection} section={section} />

        <Charts />

        {section === DASHBOARD_SECTION.SELLS && (
          <Sells month={month} year={year} />
        )}

        {section === DASHBOARD_SECTION.PRODUCTS && <Products />}
      </main>
    </div>
  );
}
