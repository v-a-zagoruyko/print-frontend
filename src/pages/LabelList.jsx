import { createSignal, createMemo, For, Show, createEffect } from "solid-js";
import { apiFetch } from "api/fetch";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
  Navbar,
  Nav,
  Form,
  Button,
  Toast,
  ToastContainer,
} from "solid-bootstrap";
import { PrinterNavbar } from "components";
import { usePrinter } from "utils/PrinterContext";

const templatesMap = {
  Самокат: "!bg-red-300 !border-red-300 !text-white",
};

export function LabelList(props) {
  const [data, setData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [activeCategory, setActiveCategory] = createSignal(null);
  const [selectedDate, setSelectedDate] = createSignal(tomorrowDate());

  const [printing, setPrinting] = createSignal(null);
  const [printError, setPrintError] = createSignal(null);

  const [toasts, setToasts] = createSignal([]);

  const { selectedPrinter, printBase64, qzLoaded } = usePrinter();

  function pushToast(title, message) {
    setToasts((prev) => [...prev, { id: Date.now(), title, message }]);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function showError(message) {
    setPrintError(message);
    pushToast("Ошибка", message);
  }

  function onSelectDate(e) {
    setSelectedDate(e.target.value);
  }

  function todayDate() {
    const t = new Date();
    const month = String(t.getMonth() + 1).padStart(2, "0");
    const day = String(t.getDate()).padStart(2, "0");
    return `${t.getFullYear()}-${month}-${day}`;
  }

  function tomorrowDate() {
    const t = new Date();
    t.setDate(t.getDate() + 1);

    const month = String(t.getMonth() + 1).padStart(2, "0");
    const day = String(t.getDate()).padStart(2, "0");

    return `${t.getFullYear()}-${month}-${day}`;
  }

  createEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    setActiveCategory(null);

    apiFetch(`/v1/labels/${props.entity}/`)
      .then((res) => setData(res))
      .catch((err) => setError(err?.message || String(err)))
      .finally(() => setLoading(false));
  });

  const entities = createMemo(() => data() || []);

  const categories = createMemo(() => [
    ...new Set(
      entities()
        .map((e) => e.category)
        .filter(Boolean)
    ),
  ]);

  const filteredEntities = createMemo(() =>
    activeCategory()
      ? entities().filter((e) => e.category === activeCategory())
      : entities()
  );

  const grouped = createMemo(() => {
    const map = new Map();
    filteredEntities().forEach((e) => {
      const c = e.category || "Без категории";
      if (!map.has(c)) map.set(c, []);
      map.get(c).push(e);
    });
    return Array.from(map.entries());
  });

  const handleCategoryClick = (category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreview = async (id) => {
    if (!id) {
      showError("Не указан id");
      return;
    }

    setPrinting(id);
    setPrintError(null);

    const printWindow = window.open("", "_blank");

    const params = new URLSearchParams();
    if (selectedDate()) {
      params.set("date", selectedDate());
    }

    try {
      const url = `/v1/labels/${encodeURIComponent(
        props.entity
      )}/${encodeURIComponent(id)}/?${params.toString()}`;
      const data = await apiFetch(url);

      if (!data || !data.pdf) throw new Error("PDF не найден в ответе");

      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      if (printWindow) {
        printWindow.location.href = blobUrl;
        printWindow.onload = () => {
          printWindow.focus();
        };
      } else {
        window.open(blobUrl, "_blank");
      }
    } catch (err) {
      showError(err?.message || String(err));
      if (printWindow) printWindow.close();
    } finally {
      setPrinting(null);
    }
  };

  const handlePrint = async (id) => {
    if (!id) {
      showError("Не указан id");
      return;
    }

    setPrinting(id);
    setPrintError(null);

    const params = new URLSearchParams();
    if (selectedDate()) {
      params.set("date", selectedDate());
    }

    try {
      const url = `/v1/labels/${encodeURIComponent(
        props.entity
      )}/${encodeURIComponent(id)}/?${params.toString()}`;
      const data = await apiFetch(url);

      if (!data || !data.pdf) throw new Error("PDF не найден в ответе");

      const input = window.prompt("Количество копий", "1");
      if (input === null) {
        setPrinting(null);
        return;
      }
      const copies = parseInt(input, 10);
      if (!copies || copies < 1) throw new Error("Неверное количество копий");

      try {
        await printBase64(data.pdf, copies);
      } catch (e) {
        throw e;
      }
    } catch (err) {
      showError(err?.message || String(err));
    } finally {
      setPrinting(null);
    }
  };

  return (
    <Show
      when={!loading()}
      fallback={
        <Container
          class="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </Spinner>
        </Container>
      }
    >
      <Show
        when={!error()}
        fallback={
          <Container class="mt-3">
            <Alert variant="danger">Ошибка: {error()}</Alert>
          </Container>
        }
      >
        <PrinterNavbar />
        <Show when={props.entity === "product"}>
          <Navbar expand="lg">
            <Container>
              <Nav class="me-auto w-full d-flex align-items-center gap-2 min-h-[58px]">
                <Form.Control
                  type="date"
                  value={selectedDate()}
                  onInput={onSelectDate}
                  min={todayDate()}
                  aria-label="Выбор даты"
                  class="!w-full sm:!w-[350px]"
                  size="sm"
                />
              </Nav>
            </Container>
          </Navbar>
        </Show>
        <Container as="article" class="mt-3 mb-5">
          <div class="sticky-top bg-white py-2 mb-3 d-flex gap-2 overflow-auto">
            <Button
              class="whitespace-nowrap"
              variant={
                activeCategory() === null ? "primary" : "outline-primary"
              }
              onClick={() => handleCategoryClick(null)}
              size="sm"
            >
              Все
            </Button>

            <For each={categories()}>
              {(category) => (
                <Button
                  class="whitespace-nowrap"
                  variant={
                    activeCategory() === category
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => handleCategoryClick(category)}
                  size="sm"
                >
                  {category}
                </Button>
              )}
            </For>
          </div>

          <For each={grouped()}>
            {([category, items]) => (
              <>
                <h2 class="h5 mt-5 mb-4 text-center">{category}</h2>

                <Row class="gy-4">
                  <For each={items}>
                    {(entity) => (
                      <Col xs="12" sm="6" md="6" lg="3">
                        <Card class="h-100 d-flex flex-column" bg="light">
                          <Card.Header class="mb-2 text-muted font-semibold">
                            {entity.category || ""}
                          </Card.Header>
                          <Card.Body class="min-h-[140px] d-flex flex-column">
                            <div class="mb-auto">
                              {entity.name && (
                                <Card.Title>{entity.name}</Card.Title>
                              )}
                              {entity.street && (
                                <Card.Text>{entity.street}</Card.Text>
                              )}
                            </div>
                            <div class="mt-[22px] d-flex flex-wrap gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handlePrint(entity.id)}
                                disabled={
                                  !qzLoaded() ||
                                  !selectedPrinter() ||
                                  printing() === entity.id
                                }
                              >
                                {printing() === entity.id
                                  ? "Печать..."
                                  : "Печать"}
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handlePreview(entity.id)}
                                onAuxClick={() => handlePreview(entity.id)}
                                disabled={printing() === entity.id}
                              >
                                {printing() === entity.id
                                  ? "Загрузка..."
                                  : "Просмотр"}
                              </Button>
                              {entity.editUrl && (
                                <Button
                                  as="a"
                                  target="_blank"
                                  class="w-full"
                                  href={entity.editUrl}
                                  variant="outline-secondary"
                                  size="sm"
                                >
                                  Редактировать
                                </Button>
                              )}
                            </div>
                          </Card.Body>
                          {entity.template && (
                            <Card.Footer
                              class={`text-muted font-semibold ${
                                templatesMap[entity.template] ?? ""
                              }`}
                            >
                              {entity.template}
                            </Card.Footer>
                          )}
                        </Card>
                      </Col>
                    )}
                  </For>
                </Row>
              </>
            )}
          </For>

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
        </Container>
      </Show>
    </Show>
  );
}
