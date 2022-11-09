import { type AppType } from "next/dist/shared/lib/utils";

import "../styles/globals.css";
import { MyThemeContextProvider } from "../components/myThemeContext";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MyThemeContextProvider>
      <Component {...pageProps} />
    </MyThemeContextProvider>
  );
};

export default MyApp;
