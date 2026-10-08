import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/Layout/Layout"

import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Dashboard from "./pages/Dashboard/Dashboard"
import DeckCards from "./pages/DeckCards/DeckCards"
import DeckTraits from "./pages/DeckTraits/DeckTraits"
import Duel from "./pages/Duel/Duel"
import Result from "./pages/Result/Result"
import Profile from "./pages/Profile/Profile"
import NotFound from "./pages/NotFound/NotFound"
import CardEdit from "./pages/CardEdit/CardEdit"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route
                        path="/decks/:deckId/cards"
                        element={<DeckCards />}
                    />

                    <Route
                        path="/decks/:deckId/cards/:cardId"
                        element={<CardEdit />}
                    />

                    <Route
                        path="/decks/:deckId/traits"
                        element={<DeckTraits />}
                    />

                    <Route path="/duel" element={<Duel />} />
                    <Route path="/result/:duelId" element={<Result />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App