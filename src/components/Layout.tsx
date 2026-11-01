import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Layout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar expand="md" bg="dark" data-bs-theme="dark" as="header">
        <Container>
          <Navbar.Brand as={Link} to="/">
            FitBook
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav as="nav" aria-label="Main" className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/classes" end>
                Classes
              </Nav.Link>
              {isAuthenticated && (
                <Nav.Link as={NavLink} to="/my-bookings">
                  My bookings
                </Nav.Link>
              )}
              {isAdmin && (
                <Nav.Link as={NavLink} to="/classes/new">
                  Add class
                </Nav.Link>
              )}
            </Nav>
            <div className="d-flex align-items-center gap-2 text-light">
              {user ? (
                <>
                  <span>Signed in as {user.name}</span>
                  <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Log in
                </Link>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main id="main-content" tabIndex={-1}>
        <Container className="py-4">
          <Outlet />
        </Container>
      </main>
      <footer className="border-top py-3 mt-4 text-body-secondary small">
        <Container>
          Demo app: data and bookings are simulated and reset when you refresh the page.
        </Container>
      </footer>
    </>
  )
}
