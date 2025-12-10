import { createSignal, createMemo, For, Show, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { apiFetch } from "api/fetch";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
  Button,
} from "solid-bootstrap";

export function LabelList(props) {
  const [data, setData] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [activeCategory, setActiveCategory] = createSignal(null);

  const [printing, setPrinting] = createSignal(null);
  const [printError, setPrintError] = createSignal(null);

  createEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    setActiveCategory(null);

    apiFetch(`/label/${props.entity}/`)
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

  const handlePrint = async (id) => {
    if (!id) {
      setPrintError("Не указан id");
      return;
    }

    setPrinting(id);
    setPrintError(null);

    const printWindow = window.open("", "_blank");

    try {
      const url = `/label/${encodeURIComponent(props.entity)}/${encodeURIComponent(id)}/`;
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
      setPrintError(err?.message || String(err));
      if (printWindow) printWindow.close();
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
        <Container as="article" class="mt-3 mb-5">
          <Show when={printError()}>
            <Alert variant="danger" class="mb-3">
              {printError()}
            </Alert>
          </Show>

          <div class="sticky-top bg-white py-2 mb-3 d-flex gap-2 overflow-auto">
            <Button
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
                        <Card class="h-100 d-flex flex-column">
                          <Card.Body class="d-flex flex-column">
                            <Card.Subtitle class="mb-2 text-muted">
                              {entity.category || ""}
                            </Card.Subtitle>
                            <Card.Title>{entity.name || ""}</Card.Title>
                            {entity.street && (
                              <Card.Text>{entity.street || ""}</Card.Text>
                            )}
                            <div class="mt-auto d-flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handlePrint(entity.id)}
                                disabled={printing() === entity.id}
                              >
                                {printing() === entity.id ? "Печать..." : "Печать"}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </For>
                </Row>
              </>
            )}
          </For>
        </Container>
      </Show>
    </Show>
  );
}
