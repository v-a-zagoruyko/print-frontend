import { Container, Navbar, Nav } from "solid-bootstrap";
import { A } from "@solidjs/router";
import { useInfo } from "utils/InfoContext";

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

export function MainLayout(props) {
    const info = useInfo();

    return (
        <>
            <Navbar expand="lg" class="mb-4">
                <Container>
                    <Navbar.Brand>
                        <Nav.Link as={A} href="/">
                            {info.company_name} {info.is_superuser}
                        </Nav.Link>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-navbar-collapse" />

                    <Navbar.Collapse id="main-navbar-collapse">
                        <Nav class="me-auto">
                            <Nav.Link as={A} href="/print/products">
                                Этикетки товаров
                            </Nav.Link>
                            <Nav.Link as={A} href="/print/contractors">
                                Этикетки контрагентов
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Navbar.Text><a href={LOGIN_URL}>{info.username}</a></Navbar.Text>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container class="max-w-[1350px] mx-auto d-flex flex-column">
                {props.children}
            </Container>
        </>
    );
}
