import { Outlet } from "react-router-dom"
import Header from "../Header/Header"
import "./Layout.scss"

function Layout() {
    return (
        <>
            <Header />

            <main className="layout__content">
                <Outlet />
            </main>
        </>
    )
}

export default Layout