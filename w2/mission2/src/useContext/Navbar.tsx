import ThemeContext from "./ThemeContent";
import { useContext } from "react";

export default function Navbar() {
  const context = useContext(ThemeContext);

  console.log(context);
  return <div>Navbar</div>;
}
