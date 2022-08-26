import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import store from "./store";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { CookiesProvider } from "react-cookie";

i18next
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        react: {
            useSuspense: false, //   <---- this will do the magic
        },
        fallbackLng: "en",
        debug: false,
        // Options for language detector
        detection: {
            order: ["path", "cookie", "htmlTag"],
            caches: ["cookie"],
        },
        backend: {
            loadPath: `/locales/{{lng}}/admin_coach.json`,
        },
    });

ReactDOM.render(
    <Provider store={store}>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can chađinge
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
