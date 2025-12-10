/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App.jsx";
import { Main, LabelList } from "pages";
import { MainLayout } from "layouts";

render(
  () => (
    <Router root={App}>
      <Route
        path="/"
        component={() => (
          <MainLayout>
            <Main />
          </MainLayout>
        )}
      />
      <Route
        path="/print/products"
        component={() => (
          <MainLayout>
            <LabelList entity="product" />
          </MainLayout>
        )}
      />
      <Route
        path="/print/contractors"
        component={() => (
          <MainLayout>
            <LabelList entity="contractor" />
          </MainLayout>
        )}
      />
    </Router>
  ),
  document.getElementById("root")
);
