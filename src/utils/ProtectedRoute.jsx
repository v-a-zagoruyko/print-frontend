import { createResource, Show } from "solid-js";
import { apiFetch } from "api/fetch";
import { Container, Spinner } from "solid-bootstrap";
import { InfoContext } from "./InfoContext";

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

export function ProtectedRoute(props) {
    const [info] = createResource(async () => {
        try {
            const data = await apiFetch("/info/");
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
                    ? (() => { window.location.href = LOGIN_URL; return null })()
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
