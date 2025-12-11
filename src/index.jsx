/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App.jsx";
import { Main, LabelList } from "pages";
import { MainLayout } from "layouts";
import { ProtectedRoute } from "utils";

render(
  () => (
    <Router root={App}>
      <Route
        path="/"
        component={() => (
          <ProtectedRoute>
            <MainLayout>
              <Main />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/print/products"
        component={() => (
          <ProtectedRoute>
            <MainLayout>
              <LabelList entity="product" />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/print/contractors"
        component={() => (
          <ProtectedRoute>
            <MainLayout>
              <LabelList entity="contractor" />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
    </Router>
  ),
  document.getElementById("root")
);
