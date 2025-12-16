import { A } from "@solidjs/router";
import { Container, Card, Button, Alert } from "solid-bootstrap";
import { createSignal } from "solid-js";

export function Default(props) {
  const [error] = createSignal(props?.error ?? "");
  return (
    <Container
      as="main"
      class="mt-3 mb-5 d-flex justify-content-center align-items-center min-h-[80vh]"
    >
      <Card class="p-3 w-full sm:w-[420px]">
        <Card.Body class="d-flex flex-column">
          <Card.Title>Страница не найдена</Card.Title>
          <div class="mt-3">
            <p>Запрошенная страница не существует или была перемещена.</p>
            {error() && <Alert variant="danger">Ошибка: {error()}</Alert>}
          </div>
          <div class="mt-3">
            <A href="/" class="text-decoration-none">
              <Button variant="primary" size="sm">
                На главную
              </Button>
            </A>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
