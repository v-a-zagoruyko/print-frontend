import { createSignal, Show } from "solid-js";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Placeholder,
  Alert,
  Toast,
  ToastContainer,
  Button,
} from "solid-bootstrap";
import { usePrinter } from "utils/PrinterContext";

export function PrinterNavbar() {
  const {
    printers,
    selectedPrinter,
    choosePrinter,
    refreshPrinters,
    qzLoaded,
    qzError,
  } = usePrinter();
  const [toasts, setToasts] = createSignal([]);

  function pushToast(title, message) {
    setToasts((prev) => [...prev, { id: Date.now(), title, message }]);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function onSelect(e) {
    const name = e.target.value;
    try {
      choosePrinter(name);
    } catch (err) {
      pushToast("Ошибка", "Не удалось выбрать принтер");
    }
  }

  async function onRefresh() {
    try {
      await refreshPrinters();
      pushToast("Готово", "Список принтеров обновлён");
    } catch (err) {
      pushToast("Ошибка", err?.message || String(err));
    }
  }

  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Nav class="me-auto w-full d-flex align-items-center gap-2 min-h-[58px]">
            <Show
              when={printers().length > 0}
              fallback={
                <Placeholder animation="glow">
                  <Placeholder
                    as="div"
                    class="!w-full sm:!w-[350px] h-[31px] rounded"
                  />
                </Placeholder>
              }
            >
              <Form.Select
                value={selectedPrinter() || ""}
                onInput={onSelect}
                aria-label="Printer select"
                class="!w-full sm:!w-[350px]"
                size="sm"
                disabled={!qzLoaded()}
              >
                <option value="">Выберите принтер</option>
                {printers().map((p) => (
                  <option value={p} key={p}>
                    {p}
                  </option>
                ))}
              </Form.Select>
            </Show>
            <Button
              onClick={onRefresh}
              variant="secondary"
              class="!w-full sm:!w-auto"
              size="sm"
              disabled={!qzLoaded()}
            >
              Обновить
            </Button>
            {!qzLoaded() && qzError() && (
              <Alert variant="danger" class="ml-auto mb-0">
                Ошибка: {qzError()}
              </Alert>
            )}
          </Nav>
        </Container>
      </Navbar>

      <ToastContainer position="top-end" class="p-3">
        {toasts().map((t) => (
          <Toast
            show={true}
            onClose={() => removeToast(t.id)}
            autohide={true}
            delay={3000}
            key={t.id}
          >
            <Toast.Header>
              <strong class="me-auto">{t.title}</strong>
            </Toast.Header>
            <Toast.Body>{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
}
