<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; padding: 30px; }
  .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #c0392b; padding-bottom: 20px; }
  .cabinet-name { font-size: 22px; font-weight: bold; color: #c0392b; }
  .cabinet-info { font-size: 11px; color: #555; margin-top: 4px; line-height: 1.6; }
  .facture-title { text-align: right; }
  .facture-title h2 { font-size: 20px; color: #c0392b; }
  .facture-title .numero { font-size: 13px; color: #555; margin-top: 4px; }
  .parties { display: flex; justify-content: space-between; margin: 24px 0; }
  .partie { width: 48%; }
  .partie-label { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; margin-bottom: 6px; }
  .partie-name { font-size: 14px; font-weight: bold; color: #222; }
  .partie-info { font-size: 11px; color: #555; margin-top: 3px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #f5f5f5; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 0.3px; border-bottom: 1px solid #ddd; }
  td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
  .text-right { text-align: right; }
  .totaux { margin-top: 10px; float: right; width: 280px; }
  .totaux-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; }
  .totaux-row.total { border-top: 2px solid #c0392b; font-weight: bold; font-size: 14px; color: #c0392b; padding-top: 10px; margin-top: 4px; }
  .statut { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; }
  .statut-paye { background: #eafbea; color: #1a7a4a; }
  .statut-attente { background: #fff8e6; color: #cc8800; }
  .statut-partiel { background: #e8f4ff; color: #1a5fa8; }
  .statut-annule { background: #f9eceb; color: #c0392b; }
  .footer { margin-top: 60px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; font-size: 10px; color: #aaa; }
  .paiements { margin-top: 20px; clear: both; }
  .paiements h4 { font-size: 12px; color: #555; margin-bottom: 8px; }
</style>
</head>
<body>

<!-- En-tête -->
<div class="header">
  <div>
    <div class="cabinet-name">Cabinet Dentaire</div>
    <div class="cabinet-info">
      Dr. Martin Lefebvre<br>
      Chirurgien-Dentiste<br>
      Cabinet Dentaire — Casablanca
    </div>
  </div>
  <div class="facture-title">
    <h2>FACTURE</h2>
    <div class="numero">N° {{ $facture->numero_facture }}</div>
    <div class="numero">Date : {{ \Carbon\Carbon::parse($facture->date_facture)->format('d/m/Y') }}</div>
    <div style="margin-top:8px">
      @if($facture->statut === 'paye')
        <span class="statut statut-paye">PAYÉE</span>
      @elseif($facture->statut === 'partiellement_paye')
        <span class="statut statut-partiel">PARTIELLEMENT PAYÉE</span>
      @elseif($facture->statut === 'annule')
        <span class="statut statut-annule">ANNULÉE</span>
      @else
        <span class="statut statut-attente">EN ATTENTE</span>
      @endif
    </div>
  </div>
</div>

<!-- Parties -->
<div class="parties">
  <div class="partie">
    <div class="partie-label">Émetteur</div>
    <div class="partie-name">Cabinet Dentaire</div>
    <div class="partie-info">Casablanca, Maroc</div>
  </div>
  <div class="partie">
    <div class="partie-label">Patient</div>
    <div class="partie-name">{{ $facture->patient->user->name ?? '—' }}</div>
    <div class="partie-info">
      {{ $facture->patient->telephone ?? '' }}<br>
      {{ $facture->patient->ville ?? '' }}
    </div>
  </div>
</div>

<!-- Lignes de facture -->
<table>
  <thead>
    <tr>
      <th>Description</th>
      <th class="text-right">Qté</th>
      <th class="text-right">Prix unitaire</th>
      <th class="text-right">Total</th>
    </tr>
  </thead>
  <tbody>
    @foreach($facture->lignes as $ligne)
    <tr>
      <td>{{ $ligne->libelle }}</td>
      <td class="text-right">{{ $ligne->quantite }}</td>
      <td class="text-right">{{ number_format($ligne->prix_unitaire, 2, ',', ' ') }} MAD</td>
      <td class="text-right">{{ number_format($ligne->quantite * $ligne->prix_unitaire, 2, ',', ' ') }} MAD</td>
    </tr>
    @endforeach
  </tbody>
</table>

<!-- Totaux -->
<div class="totaux">
  <div class="totaux-row">
    <span>Sous-total</span>
    <span>{{ number_format($facture->montant_total, 2, ',', ' ') }} MAD</span>
  </div>
  @if($facture->montant_paye > 0)
  <div class="totaux-row">
    <span>Déjà payé</span>
    <span>- {{ number_format($facture->montant_paye, 2, ',', ' ') }} MAD</span>
  </div>
  <div class="totaux-row">
    <span>Reste à payer</span>
    <span>{{ number_format($facture->montant_total - $facture->montant_paye, 2, ',', ' ') }} MAD</span>
  </div>
  @endif
  <div class="totaux-row total">
    <span>TOTAL</span>
    <span>{{ number_format($facture->montant_total, 2, ',', ' ') }} MAD</span>
  </div>
</div>

<!-- Paiements -->
@if($facture->paiements && $facture->paiements->count() > 0)
<div class="paiements">
  <h4>Paiements enregistrés</h4>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Mode</th>
        <th class="text-right">Montant</th>
      </tr>
    </thead>
    <tbody>
      @foreach($facture->paiements as $p)
      <tr>
        <td>{{ \Carbon\Carbon::parse($p->date_paiement)->format('d/m/Y') }}</td>
        <td>{{ ucfirst(str_replace('_', ' ', $p->mode_paiement)) }}</td>
        <td class="text-right">{{ number_format($p->montant, 2, ',', ' ') }} MAD</td>
      </tr>
      @endforeach
    </tbody>
  </table>
</div>
@endif

<!-- Notes -->
@if($facture->notes)
<div style="margin-top:30px; clear:both; padding:12px; background:#f9f9f9; border-radius:6px; font-size:11px; color:#555;">
  <strong>Notes :</strong> {{ $facture->notes }}
</div>
@endif

<div class="footer">
  Cabinet Dentaire — Merci de votre confiance
</div>

</body>
</html>
