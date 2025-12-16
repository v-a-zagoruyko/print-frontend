/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "./App.jsx";
import { Main, LabelList, Protected, Default } from "pages";
import { MainLayout } from "layouts";
import { ProtectedRoute } from "utils";

const accessGroups = {
  "print": ['Печатник'],
}

render(
  () => (
    <Router root={App}>
      <Route
        path="/"
        component={() => (
          <ProtectedRoute accessGroups={accessGroups.print}>
            <MainLayout>
              <Main />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/print/products"
        component={() => (
          <ProtectedRoute accessGroups={accessGroups.print}>
            <MainLayout>
              <LabelList entity="product" />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/print/contractors"
        component={() => (
          <ProtectedRoute accessGroups={accessGroups.print}>
            <MainLayout>
              <LabelList entity="contractor" />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/error"
        component={() => (
          <ProtectedRoute>
            <MainLayout>
              <Protected />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="*"
        component={() => (
          <ProtectedRoute>
            <MainLayout>
              <Default />
            </MainLayout>
          </ProtectedRoute>
        )}
      />
    </Router>
  ),
  document.getElementById("root")
);
