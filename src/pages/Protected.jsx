import { A } from "@solidjs/router";
import { Container, Card, Button } from "solid-bootstrap";

export function Protected() {
  return (
    <Container
      as="main"
      class="mt-3 mb-5 d-flex justify-content-center align-items-center min-h-[80vh]"
    >
      <Card class="p-3 w-full sm:w-[420px]" bg="danger" text="light">
        <Card.Body class="d-flex flex-column">
          <Card.Title>Ошибка</Card.Title>
          <div class="mt-3">
            <p>Недостаточно прав для просмотра страницы.</p>
          </div>
          <div class="mt-3">
            <A href="/" class="text-decoration-none">
              <Button variant="light" size="sm">
                На главную
              </Button>
            </A>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
