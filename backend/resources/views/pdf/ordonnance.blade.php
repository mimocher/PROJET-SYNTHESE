<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; padding: 30px; }
  .header { border-bottom: 2px solid #c0392b; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
  .cabinet-name { font-size: 20px; font-weight: bold; color: #c0392b; }
  .cabinet-info { font-size: 11px; color: #555; margin-top: 4px; line-height: 1.6; }
  .ordonnance-label { text-align: right; }
  .ordonnance-label h2 { font-size: 18px; color: #c0392b; text-transform: uppercase; letter-spacing: 1px; }
  .ordonnance-label .date { font-size: 11px; color: #555; margin-top: 4px; }
  .patient-box { background: #f9f9f9; border-left: 3px solid #c0392b; padding: 12px 16px; margin-bottom: 24px; border-radius: 0 6px 6px 0; }
  .patient-box .label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; }
  .patient-box .nom { font-size: 15px; font-weight: bold; color: #222; }
  .patient-box .info { font-size: 11px; color: #555; margin-top: 3px; }
  .contenu { margin: 24px 0; padding: 20px; border: 1px solid #ddd; border-radius: 6px; min-height: 200px; }
  .contenu-label { font-size: 11px; text-transform: uppercase; color: #999; letter-spacing: 0.4px; margin-bottom: 12px; }
  .prescription { font-size: 13px; line-height: 1.9; color: #222; white-space: pre-line; }
  .notes-box { margin-top: 16px; padding: 12px; background: #fff8e6; border-radius: 6px; font-size: 11px; color: #555; }
  .signature { margin-top: 60px; display: flex; justify-content: flex-end; }
  .signature-box { text-align: center; width: 200px; }
  .signature-line { border-top: 1px solid #222; margin-bottom: 8px; }
  .signature-nom { font-size: 12px; font-weight: bold; }
  .signature-titre { font-size: 10px; color: #555; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #eee; text-align: center; font-size: 10px; color: #aaa; }
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="cabinet-name">Cabinet Dentaire</div>
    <div class="cabinet-info">
      Dr. Martin Lefebvre — Chirurgien-Dentiste<br>
      Casablanca, Maroc
    </div>
  </div>
  <div class="ordonnance-label">
    <h2>Ordonnance</h2>
    <div class="date">{{ \Carbon\Carbon::parse($ordonnance->date_ordonnance)->format('d/m/Y') }}</div>
  </div>
</div>

<!-- Patient -->
<div class="patient-box">
  <div class="label">Patient</div>
  <div class="nom">{{ $ordonnance->patient->user->name ?? '—' }}</div>
  <div class="info">
    @if($ordonnance->patient->date_naissance)
      Né(e) le {{ \Carbon\Carbon::parse($ordonnance->patient->date_naissance)->format('d/m/Y') }}
      ({{ \Carbon\Carbon::parse($ordonnance->patient->date_naissance)->age }} ans)
    @endif
    @if($ordonnance->patient->telephone)
      — {{ $ordonnance->patient->telephone }}
    @endif
  </div>
</div>

<!-- Prescription -->
<div class="contenu">
  <div class="contenu-label">Prescription médicale</div>
  <div class="prescription">{{ $ordonnance->contenu }}</div>
</div>

@if($ordonnance->notes)
<div class="notes-box">
  <strong>Instructions :</strong> {{ $ordonnance->notes }}
</div>
@endif

<!-- Signature -->
<div class="signature">
  <div class="signature-box">
    <div style="height:50px;"></div>
    <div class="signature-line"></div>
    <div class="signature-nom">Dr. {{ $ordonnance->dentiste->name ?? 'Martin Lefebvre' }}</div>
    <div class="signature-titre">Chirurgien-Dentiste</div>
  </div>
</div>

<div class="footer">
  Document confidentiel — Cabinet Dentaire
</div>

</body>
</html>
