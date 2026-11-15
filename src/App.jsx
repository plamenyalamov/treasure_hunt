import { useState } from "react";
import Menu from "./components/Menu.jsx";

const ITEMS = [
  { id: "home", label: "Home", hint: "Back to the start" },
  { id: "projects", label: "Projects", hint: "Everything you're working on" },
  { id: "settings", label: "Settings", hint: "Account and preferences" },
  { id: "help", label: "Help", hint: "Guides and support" },
];

export default function App() {
  const [selected, setSelected] = useState(ITEMS[0]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>My app</h1>
        <Menu label="Menu" items={ITEMS} onSelect={setSelected} />
      </header>
      <main>
        <h2>{selected.label}</h2>
        <p>{selected.hint}</p>
      </main>
    </div>
  );
}
