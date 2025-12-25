import { createResource, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Container, Spinner } from "solid-bootstrap";
import { apiFetch } from "api/fetch";
import { PrinterProvider } from "./PrinterContext";
import { InfoContext } from "./InfoContext";

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

function buildLoginRedirect() {
  const current = window.location.href;
  try {
    const login = new URL(LOGIN_URL);
    login.searchParams.set("next", `/post_login_redirect/?url=${current}`);
    return login.toString();
  } catch {
    return `${LOGIN_URL}?next=/post_login_redirect/?url=${encodeURIComponent(
      current
    )}`;
  }
}

export function ProtectedRoute(props) {
  const navigate = useNavigate();

  const [info] = createResource(async () => {
    try {
      const data = await apiFetch("/user/");
      return { success: true, data };
    } catch {
      return { success: false };
    }
  });

  const hasRequiredGroups = (userGroups, requiredGroups) => {
    if (!requiredGroups || requiredGroups.length === 0) return true;
    const set = new Set(userGroups || []);
    return requiredGroups.every((g) => set.has(g));
  };

  const checkPermissions = (user, requiredGroups) => {
    if (!user || !user.isStaff) return false;
    if (user.isSuperuser) return true;
    return hasRequiredGroups(user.groups, requiredGroups);
  };

  return (
    <Show
      when={info() && info().success}
      fallback={
        info() && !info().success ? (
          (() => {
            window.location.href = buildLoginRedirect();
            return null;
          })()
        ) : (
          <Container
            class="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <Spinner animation="border" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </Spinner>
          </Container>
        )
      }
    >
      {(() => {
        const allowed = checkPermissions(info().data, props.accessGroups);
        if (!allowed) {
          navigate("/error", { replace: true });
          return null;
        }
        return (
          <PrinterProvider>
            <InfoContext.Provider value={info().data}>
              {props.children}
            </InfoContext.Provider>
          </PrinterProvider>
        );
      })()}
    </Show>
  );
}
