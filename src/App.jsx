// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import CartSidebar  from './components/CartSidebar';
import PrivateRoute from './components/PrivateRoute';

// ── Pages publiques ───────────────────────────────────────────────────────────
import Home         from './pages/Home';
import About        from './pages/About';
import Services     from './pages/Services';
import Reservations from './pages/Reservations';
import Login        from './pages/Login';
import Register     from './pages/Register';

// ── Espace secrétaire ─────────────────────────────────────────────────────────
import SecretaireLayout from './pages/secretaire/SecretaireLayout';
import SecDashboard     from './pages/secretaire/Dashboard';
import SecPatients      from './pages/secretaire/Patients';
import SecAgenda        from './pages/secretaire/Agenda';
import SecFacturation   from './pages/secretaire/Facturation';
import SecCommunication from './pages/secretaire/Communication';

// ── Espace dentiste ───────────────────────────────────────────────────────────
import DentisteLayout from './pages/dentiste/DentisteLayout';
import Planning       from './pages/dentiste/Planning';
import Dossiers       from './pages/dentiste/Dossiers';
import Traitements    from './pages/dentiste/Traitements';
import Ordonnances    from './pages/dentiste/Ordonnances';
import Statistiques   from './pages/dentiste/Statistiques';

// ── Espace patient ────────────────────────────────────────────────────────────
import PatientLayout  from './pages/patient/PatientLayout';
import Dashboard      from './pages/patient/Dashboard';      // ✅ tableau de bord
import MesRdv         from './pages/patient/MesRdv';
import PrendreRdv     from './pages/patient/PrendreRdv';
import MonDossier     from './pages/patient/MonDossier';
import MesFactures    from './pages/patient/MesFactures';
import MesOrdonnances from './pages/patient/MesOrdonnances';
import MonProfil      from './pages/patient/MonProfil';

// ── Layout public ─────────────────────────────────────────────────────────────
const PublicLayout = ({ children, withCart = false }) => (
  <div className="App">
    <Navbar />
    {withCart && <CartSidebar />}
    <main>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>

          {/* ── Pages publiques ─────────────────────────────────────────── */}
          <Route path="/"             element={<PublicLayout withCart><Home /></PublicLayout>} />
          <Route path="/about"        element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services"     element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/reservations" element={<PublicLayout withCart><Reservations /></PublicLayout>} />
          <Route path="/panier"       element={<PublicLayout withCart>{null}</PublicLayout>} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />

          {/* ── Espace patient ───────────────────────────────────────────── */}
          <Route path="/patient" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientLayout />
            </PrivateRoute>
          }>
            <Route index                  element={<Dashboard />} />      {/* /patient → Dashboard */}
            <Route path="prendre-rdv"     element={<PrendreRdv />} />
            <Route path="rdv"             element={<MesRdv />} />
            <Route path="dossier"         element={<MonDossier />} />
            <Route path="factures"        element={<MesFactures />} />
            <Route path="ordonnances"     element={<MesOrdonnances />} />
            <Route path="profil"          element={<MonProfil />} />      {/* ✅ profil sans "mon-" */}
          </Route>

          {/* ── Espace secrétaire ────────────────────────────────────────── */}
          <Route path="/secretaire" element={
            <PrivateRoute allowedRoles={['secretaire']}>
              <SecretaireLayout />
            </PrivateRoute>
          }>
            <Route index                element={<SecDashboard />} />
            <Route path="patients"      element={<SecPatients />} />
            <Route path="agenda"        element={<SecAgenda />} />
            <Route path="facturation"   element={<SecFacturation />} />
            <Route path="communication" element={<SecCommunication />} />
          </Route>

          {/* ── Espace dentiste ──────────────────────────────────────────── */}
          <Route path="/dentiste" element={
            <PrivateRoute allowedRoles={['dentiste']}>
              <DentisteLayout />
            </PrivateRoute>
          }>
            <Route index                element={<Planning />} />
            <Route path="dossiers"      element={<Dossiers />} />
            <Route path="traitements"   element={<Traitements />} />
            <Route path="ordonnances"   element={<Ordonnances />} />
            <Route path="statistiques"  element={<Statistiques />} />
          </Route>

          {/* ── 404 ─────────────────────────────────────────────────────── */}
          <Route path="*" element={
            <PublicLayout>
              <div style={{ textAlign: 'center', padding: '5rem' }}>
                <h2>404 — Page introuvable</h2>
              </div>
            </PublicLayout>
          } />

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;