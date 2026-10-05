import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout/Layout"

import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Dashboard from "./pages/Dashboard/Dashboard"
import Deck from "./pages/Deck/Deck"
import DeckCards from "./pages/DeckCards/DeckCards"
import DeckTraits from "./pages/DeckTraits/DeckTraits"
import DeckAbilities from "./pages/DeckAbilities/DeckAbilities"
import Duel from "./pages/Duel/Duel"
import Result from "./pages/Result/Result"
import Profile from "./pages/Profile/Profile"
import NotFound from "./pages/NotFound/NotFound"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/deck" element={<Deck />} />
                    <Route path="/deck/cards" element={<DeckCards />} />
                    <Route path="/deck/traits" element={<DeckTraits />} />
                    <Route path="/deck/abilities" element={<DeckAbilities />} />
                    <Route path="/duel" element={<Duel />} />
                    <Route path="/result" element={<Result />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App