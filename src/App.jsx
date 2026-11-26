import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SoundProvider } from "./context/SoundContext";
import { JournalProvider } from "./context/JournalContext";
import { SensesProvider } from "./context/SensesContext";
import { SECTIONS, WIKI_SECTION } from "./config/sections";
import Layout from "./layout/Layout";
import JournalToasts from "./components/JournalToasts";
import KeyboardSecrets from "./components/KeyboardSecrets";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import CharactersPage from "./pages/CharactersPage";
import MonstersPage from "./pages/MonstersPage";
import SignsPage from "./pages/SignsPage";
import LocationsPage from "./pages/LocationsPage";
import DetailPage from "./pages/DetailPage";
import SearchPage from "./pages/SearchPage";
import JournalPage from "./pages/JournalPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * All client-side routes. "/" is the full-screen welcome scene; every other
 * page renders inside the shared Layout (navbar + footer). The Journal
 * (fan easter eggs) and Witcher Senses state are shared app-wide.
 */
export default function App() {
  return (
    <BrowserRouter>
      <SoundProvider>
        <JournalProvider>
          <SensesProvider>
            <Routes>
              <Route index element={<WelcomePage />} />
              <Route element={<Layout />}>
                <Route path="home" element={<HomePage />} />
                <Route path="story" element={<StoryPage />} />
                <Route path="characters" element={<CharactersPage />} />
                <Route path="characters/:title" element={<DetailPage section={SECTIONS.characters} />} />
                <Route path="monsters" element={<MonstersPage />} />
                <Route path="monsters/:title" element={<DetailPage section={SECTIONS.monsters} />} />
                <Route path="signs" element={<SignsPage />} />
                <Route path="signs/:title" element={<DetailPage section={SECTIONS.signs} />} />
                <Route path="locations" element={<LocationsPage />} />
                <Route path="locations/:title" element={<DetailPage section={SECTIONS.locations} />} />
                <Route path="wiki/:title" element={<DetailPage section={WIKI_SECTION} />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="journal" element={<JournalPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <JournalToasts />
            <KeyboardSecrets />
          </SensesProvider>
        </JournalProvider>
      </SoundProvider>
    </BrowserRouter>
  );
}
