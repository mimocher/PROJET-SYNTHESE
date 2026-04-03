// src/pages/patient/Profil.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfil } from '../../redux/patientActions';

export default function Profil() {
  const dispatch = useDispatch();
  const user     = useSelector(s => s.auth?.user);

  // ── Formulaire profil ─────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });
  const [savedProfil, setSavedProfil] = useState(false);

  // ── Formulaire mot de passe ───────────────────────────────────────────────
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdMsg, setPwdMsg]   = useState(null); // { type: 'ok'|'err', text }
  const [pwdEmail, setPwdEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfil = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    dispatch(updateProfil(form));
    setSavedProfil(true);
    setTimeout(() => setSavedProfil(false), 2500);
  };

  const changePwd = () => {
    if (pwd.current !== user?.password) {
      setPwdMsg({ type: 'err', text: 'Mot de passe actuel incorrect.' });
      return;
    }
    if (pwd.next.length < 6) {
      setPwdMsg({ type: 'err', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdMsg({ type: 'err', text: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }
    // En prod → appel API ; ici on met à jour localStorage
    dispatch(updateProfil({ password: pwd.next }));
    setPwdMsg({ type: 'ok', text: 'Mot de passe modifié avec succès !' });
    setPwd({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwdMsg(null), 3000);
  };

  const sendResetEmail = () => {
    if (!pwdEmail.trim()) return;
    // En prod → POST /api/auth/forgot-password
    // Ici : simulation
    setEmailSent(true);
    setTimeout(() => { setEmailSent(false); setPwdEmail(''); }, 4000);
  };

  const initiales = user?.name ? user.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : 'PA';

  return (
    <div>
      <div className="pat-page-header">
        <div className="pat-page-label">Mon compte</div>
        <h1 className="pat-page-title">Mon <em>profil</em></h1>
        <p className="pat-page-sub">Gérez vos informations personnelles</p>
      </div>

      <div className="pat-grid-2">

        {/* ── Modification du profil ── */}
        <div className="pat-card">
          <div className="pat-card-title">Informations personnelles</div>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--pat-red-light)', border: '2px solid var(--pat-red-mid)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 600, color: 'var(--pat-red)',
            }}>{initiales}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--pat-dark)' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--pat-muted)' }}>Patient — {user?.email}</div>
            </div>
          </div>

          {[
            { name: 'name',    label: 'Nom complet *',    type: 'text'  },
            { name: 'email',   label: 'Adresse email *',  type: 'email' },
            { name: 'phone',   label: 'Téléphone',        type: 'tel'   },
            { name: 'address', label: 'Adresse postale',  type: 'text'  },
          ].map(({ name, label, type }) => (
            <div className="pat-form-group" key={name}>
              <label className="pat-form-label">{label}</label>
              <input className="pat-form-control" type={type} name={name}
                value={form[name]} onChange={onChange} placeholder={label.replace(' *', '')} />
            </div>
          ))}

          {savedProfil ? (
            <div className="pat-alert pat-alert-ok">✓ Profil mis à jour avec succès !</div>
          ) : (
            <button className="pat-btn-primary" onClick={saveProfil} style={{ width: '100%' }}>
              Enregistrer les modifications
            </button>
          )}
        </div>

        {/* ── Sécurité ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Changer mot de passe */}
          <div className="pat-card">
            <div className="pat-card-title">Changer le mot de passe</div>

            {pwdMsg && (
              <div className={`pat-alert ${pwdMsg.type === 'ok' ? 'pat-alert-ok' : 'pat-alert-err'}`}>
                {pwdMsg.text}
              </div>
            )}

            {[
              { name: 'current', label: 'Mot de passe actuel *',     placeholder: '••••••••' },
              { name: 'next',    label: 'Nouveau mot de passe *',     placeholder: 'Min. 6 caractères' },
              { name: 'confirm', label: 'Confirmer le nouveau *',     placeholder: '••••••••' },
            ].map(({ name, label, placeholder }) => (
              <div className="pat-form-group" key={name}>
                <label className="pat-form-label">{label}</label>
                <input className="pat-form-control" type="password"
                  value={pwd[name]}
                  onChange={e => setPwd(p => ({ ...p, [name]: e.target.value }))}
                  placeholder={placeholder} />
              </div>
            ))}

            <button className="pat-btn-primary" onClick={changePwd} style={{ width: '100%' }}>
              Modifier le mot de passe
            </button>
          </div>

          {/* Réinitialisation par email */}
          <div className="pat-card">
            <div className="pat-card-title">Mot de passe oublié ?</div>
            <p style={{ fontSize: 13, color: 'var(--pat-muted)', marginBottom: 12, lineHeight: 1.5 }}>
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </p>

            {emailSent ? (
              <div className="pat-alert pat-alert-ok">
                ✉️ Un email de réinitialisation a été envoyé à <strong>{pwdEmail}</strong>.
                Vérifiez votre boîte mail.
              </div>
            ) : (
              <>
                <div className="pat-form-group">
                  <label className="pat-form-label">Adresse email</label>
                  <input className="pat-form-control" type="email"
                    value={pwdEmail} onChange={e => setPwdEmail(e.target.value)}
                    placeholder="votre@email.com" />
                </div>
                <button className="pat-btn-secondary" onClick={sendResetEmail} style={{ width: '100%' }}>
                  Envoyer le lien de réinitialisation
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
