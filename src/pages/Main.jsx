import { A } from "@solidjs/router";
import { Container, Card, Button } from "solid-bootstrap";

export function Main() {
    return (
        <Container as="main" class="mt-3 mb-5 d-flex justify-content-center align-items-center min-h-[80vh]">
            <div class="d-flex flex-column flex-lg-row gap-4 justify-content-center align-items-center w-100">
                <Card class="p-3 w-full sm:w-[350px]">
                    <Card.Body class="d-flex flex-column">
                        <Card.Title>Этикетки товаров</Card.Title>
                        <div class="mt-[18px]">
                            <A href="/print/products" class="text-decoration-none">
                                <Button variant="primary" size="sm">Перейти</Button>
                            </A>
                        </div>
                    </Card.Body>
                </Card>

                <Card class="p-3 w-full sm:w-[350px]">
                    <Card.Body class="d-flex flex-column">
                        <Card.Title>Этикетки контрагентов</Card.Title>
                        <div class="mt-[18px]">
                            <A href="/print/contractors" class="text-decoration-none">
                                <Button variant="primary" size="sm">Перейти</Button>
                            </A>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}
