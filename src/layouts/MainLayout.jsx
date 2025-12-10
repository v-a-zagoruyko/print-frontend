import { Container, Navbar, Nav, Offcanvas } from "solid-bootstrap";
import { A } from "@solidjs/router";

export function MainLayout(props) {
    return (
        <>
            <Navbar expand="lg" class="mb-4">
                <Container>
                    <Navbar.Brand>
                        ООО "Большие молодцы"
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-navbar-collapse" />

                    <Navbar.Collapse id="main-navbar-collapse">
                        <Nav class="ms-auto">
                            <Nav.Link as={A} href="/print/products">
                                Этикетки товаров
                            </Nav.Link>
                            <Nav.Link as={A} href="/print/contractors">
                                Этикетки контрагентов
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Offcanvas
                        id="main-navbar-offcanvas"
                        aria-labelledby="main-navbar-label"
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="main-navbar-label">
                                Меню
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav class="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link as={A} href="/print/products">
                                    Этикетки товаров
                                </Nav.Link>
                                <Nav.Link as={A} href="/print/contractors">
                                    Этикетки контрагентов
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            <Container class="max-w-[1350px] mx-auto d-flex flex-column">
                {props.children}
            </Container>
        </>
    );
}
