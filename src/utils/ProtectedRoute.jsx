import { createResource, Show } from "solid-js";
import { apiFetch } from "api/fetch";
import { Container, Spinner } from "solid-bootstrap";
import { InfoContext } from "./InfoContext";

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

function buildLoginRedirect() {
    const current = window.location.href;
    try {
        const login = new URL(LOGIN_URL);
        login.searchParams.set("next", `/post_login_redirect/?url=${current}`);
        return login.toString();
    } catch {
        return `${LOGIN_URL}?next=/post_login_redirect/?url=${encodeURIComponent(current)}`;
    }
}

export function ProtectedRoute(props) {
    const [info] = createResource(async () => {
        try {
            const data = await apiFetch("/user/");
            return { success: true, data };
        } catch {
            return { success: false };
        }
    });

    return (
        <Show
            when={info() && info().success}
            fallback={
                info() && !info().success
                    ? (() => { window.location.href = buildLoginRedirect(); return null })()
                    : (
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
            <InfoContext.Provider value={info().data}>
                {props.children}
            </InfoContext.Provider>
        </Show>
    );
}
