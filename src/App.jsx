// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './redux/store';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import CartSidebar from './components/CartSidebar';
// import Home from './pages/Home';
// import About from './pages/About';
// import Services from './pages/Services';
// import Reservations from './pages/Reservations';
// import Login from './pages/Login';
// import Register from './pages/Register';

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <div className="App">
//           <Navbar />
//           <CartSidebar />
//           <main>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/services" element={<Services />} />
//               <Route path="/reservations" element={<Reservations />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/panier" element={<CartSidebar />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </Router>
//     </Provider>
//   );
// }

// export default App;
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

// ── Tes composants existants ──────────────────────────────────────────────────
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import CartSidebar from './components/CartSidebar';

// ── Tes pages existantes ──────────────────────────────────────────────────────
import Home         from './pages/Home';
import About        from './pages/About';
import Services     from './pages/Services';
import Reservations from './pages/Reservations';
import Login        from './pages/Login';
import Register     from './pages/Register';

// ── Pages secrétaire ─────────────────────────────────────────────────────────
import SecretaireLayout from './pages/secretaire/SecretaireLayout';
import Dashboard        from './pages/secretaire/Dashboard';
import Patients         from './pages/secretaire/Patients';
import Agenda           from './pages/secretaire/Agenda';
import Facturation      from './pages/secretaire/Facturation';
import Communication    from './pages/secretaire/Communication';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>

          {/* ── Tes pages existantes (inchangées) ────────────────────────── */}
          <Route path="/" element={
            <div className="App"><Navbar /><CartSidebar /><main><Home /></main><Footer /></div>
          } />
          <Route path="/about" element={
            <div className="App"><Navbar /><main><About /></main><Footer /></div>
          } />
          <Route path="/services" element={
            <div className="App"><Navbar /><main><Services /></main><Footer /></div>
          } />
          <Route path="/reservations" element={
            <div className="App"><Navbar /><CartSidebar /><main><Reservations /></main><Footer /></div>
          } />
          <Route path="/login" element={
            <div className="App"><Navbar /><main><Login /></main><Footer /></div>
          } />
          <Route path="/register" element={
            <div className="App"><Navbar /><main><Register /></main><Footer /></div>
          } />
          <Route path="/panier" element={
            <div className="App"><Navbar /><CartSidebar /><Footer /></div>
          } />

          {/* ── Espace secrétaire ─────────────────────────────────────────── */}
          <Route path="/secretaire" element={<SecretaireLayout />}>
            <Route index                element={<Dashboard />} />
            <Route path="patients"      element={<Patients />} />
            <Route path="agenda"        element={<Agenda />} />
            <Route path="facturation"   element={<Facturation />} />
            <Route path="communication" element={<Communication />} />
          </Route>

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;