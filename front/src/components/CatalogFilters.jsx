import React from "react";
import AnimatedSelect from "./AnimatedSelect";

const CatalogFilters = ({ filters, changeFilter, resetFilters }) => {
  const activeCount = Object.values(filters).filter((value) => value !== "" && value !== false).length;
  const selectOptions = {
    ram_size: [{ value: "", label: "Любая" }, ...[4, 6, 8, 12, 16, 24].map((n) => ({ value: String(n), label: `${n} ГБ` }))],
    rom_size: [{ value: "", label: "Любая" }, ...[{n:64,l:"64 ГБ"},{n:128,l:"128 ГБ"},{n:256,l:"256 ГБ"},{n:512,l:"512 ГБ"},{n:1024,l:"1 ТБ"}].map(({n,l})=>({value:String(n),label:l}))],
    launch_year: [{ value: "", label: "Любой" }, ...[2026,2025,2024,2023,2022,2021,2020,2019,2018].map((year) => ({ value: String(year), label: String(year) }))],
    screen_type: [{value:"",label:"Любой"},{value:"AMOLED",label:"AMOLED"},{value:"OLED",label:"OLED"},{value:"IPS",label:"IPS"},{value:"LCD",label:"LCD"}],
    os_version: [{value:"",label:"Любая"},{value:"Android",label:"Android"},{value:"iOS",label:"iOS"}],
    protection: [{value:"",label:"Любая"},{value:"IP68",label:"IP68"},{value:"IP67",label:"IP67"},{value:"IP54",label:"IP54"}],
  };
  const select = (key, label, placeholder = "Любой") => (
    <label className="filter-field" key={key}>
      <span>{label}</span>
      <AnimatedSelect label={label} value={filters[key]} options={selectOptions[key]} placeholder={placeholder} onChange={(value) => changeFilter(key, value)} />
    </label>
  );
  const range = (keyMin, keyMax, label, unit, step = "1") => (
    <div className="filter-field" key={keyMin}>
      <span>{label}</span>
      <div className="filter-pair">
        <input type="number" min="0" step={step} value={filters[keyMin]} onChange={(event) => changeFilter(keyMin, event.target.value)} placeholder={unit ? `От, ${unit}` : "От"} aria-label={`${label}: от`} />
        <input type="number" min="0" step={step} value={filters[keyMax]} onChange={(event) => changeFilter(keyMax, event.target.value)} placeholder={unit ? `До, ${unit}` : "До"} aria-label={`${label}: до`} />
      </div>
    </div>
  );

  return (
    <aside className="filter-sidebar">
      <div className="filter-heading">
        <div><span className="filter-kicker">ПОДБОР</span><h3>Фильтры {activeCount > 0 && <span className="filter-count">{activeCount}</span>}</h3></div>
        <button type="button" onClick={resetFilters}>Сбросить</button>
      </div>
      <label className="filter-field">
        <span>Бренд</span>
        <input value={filters.brand} onChange={(event) => changeFilter("brand", event.target.value)} placeholder="Например, Samsung" />
      </label>
      {range("min_price", "max_price", "Цена, ₽", "₽")}
      {select("ram_size", "Оперативная память, от")}
      {select("rom_size", "Встроенная память, от")}
      {range("min_screen_size", "max_screen_size", "Диагональ экрана, ″", "″", "0.1")}
      {range("min_screen_fps", "max_screen_fps", "Частота экрана, Гц", "Гц")}
      {select("launch_year", "Год выпуска, от")}
      {select("screen_type", "Тип экрана")}
      {select("os_version", "Операционная система")}
      {select("protection", "Защита корпуса")}
      <div className="filter-toggles">
        {[["has_5g","Поддержка 5G"],["nfc","NFC"],["wireless_charging","Беспроводная зарядка"]].map(([key,label]) => (
          <label className="filter-check" key={key}>
            <input type="checkbox" checked={Boolean(filters[key])} onChange={(event) => changeFilter(key, event.target.checked)} />
            <span className="filter-check-box" aria-hidden="true"></span><span>{label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};
export default CatalogFilters;
