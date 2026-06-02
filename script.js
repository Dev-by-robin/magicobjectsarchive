// Data van de objecten
  const objecten = [
    {
      id: 'thing',
      naam: 'THING',
      risico: 'hoog',
      herkomst: 'onbekend',
      verboden: 'ja',
      beschrijving: 'Thing is een levende hand binnen het archief. Oorspronkelijk was Thing de hand van Isaac Night, een voormalige student van Nevermore Academy. Tijdens een ongeluk met een gevaarlijke machine werd zijn hand afgehakt. Door een elektrische ontlading kwam de hand vervolgens tot leven.',
      korteBeschrijving: 'Thing is een loslopende hand met een aantal bijzondere dingetjes.',
      magischeEigenschappen: 'Levende hand zonder lichaam',
      incidents: [
        {
          titel: 'Incidenten Log #001',
          tekst: 'Thing werd tijdelijk opnieuw vastgemaakt aan zijn oorspronkelijke eigenaar Isaac Night. Tijdens dit incident viel alle communicatie met het object volledig weg. Uiteindelijk wist Thing zichzelf los te maken en Isaac Night uit te schakelen door zijn mechanische hart te verwijderen.'
        }
      ],
      waarschuwing: 'Het is nog niet volledig onderzocht of herinneringen of bewustzijn van Isaac Night nog aanwezig zijn binnen het object.',
      afbeelding: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80'
    },
    {
      id: 'crystal-ball',
      naam: 'CRYSTAL BALL',
      risico: 'medium',
      herkomst: 'addams',
      verboden: 'nee',
      beschrijving: 'De Crystal Ball is een magisch object binnen het archief dat gebruikt wordt voor communicatie over grote afstanden. Het object werd oorspronkelijk door Morticia Addams aan Wednesday gegeven bij haar aankomst op Nevermore Academy, zodat zij contact konden houden.',
      korteBeschrijving: 'Een kristallen bol gebruikt voor communicatie over grote afstanden.',
      magischeEigenschappen: 'Magische communicatie over grote afstanden',
      incidents: [
        {
          titel: 'Incidenten Log #001',
          tekst: 'Tijdens haar eerste avond op Nevermore Academy gebruikte Wednesday de Crystal Ball om haar ouders te vertellen over meerdere gevaarlijke gebeurtenissen, waaronder twee bijna-doodervaringen, een monster en de mogelijkheid dat zij verantwoordelijk zou zijn voor de vernietiging van Nevermore.'
        }
      ],
      waarschuwing: 'Gebruik van de Crystal Ball tijdens psychische uitputting wordt afgeraden. Dit kan leiden tot aanvallen en een verdere verslechtering van de mentale toestand van de gebruiker.',
      afbeelding: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'
    }
  ];

  // Actieve filters
  let actieveFilters = {
    risico: '',
    herkomst: '',
    verboden: ''
  };

  // Of de AR al geladen is
  let arGeladen = false;
  let gekozenArObject = null;

  // Pagina's wisselen
  function showPage(pagina) {
    // AR is een aparte pagina
    if (pagina === 'ar') {
      window.location.href = 'ar.html';
      return;
    }

    document.querySelectorAll('.pagina').forEach(function(p) {
      p.classList.remove('actief');
    });

    document.querySelectorAll('.nav-knop').forEach(function(k) {
      k.classList.remove('actief');
    });

    document.getElementById('pagina-' + pagina).classList.add('actief');

    var knoppen = document.querySelectorAll('.nav-knop');
    if (pagina === 'home' || pagina === 'detail') {
      knoppen[0].classList.add('actief');
    }

    window.scrollTo(0, 0);
  }

  // Objecten lijst tonen
  function lijstTonen() {
    var lijst = document.getElementById('objecten-lijst');

    var gefilterd = objecten.filter(function(obj) {
      if (actieveFilters.risico && obj.risico !== actieveFilters.risico) return false;
      if (actieveFilters.herkomst && obj.herkomst !== actieveFilters.herkomst) return false;
      if (actieveFilters.verboden && obj.verboden !== actieveFilters.verboden) return false;
      return true;
    });

    if (gefilterd.length === 0) {
      lijst.innerHTML = '<p style="padding:32px; text-align:center; color:var(--tekst-zacht); font-size:12px; letter-spacing:0.15em;">GEEN OBJECTEN GEVONDEN</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < gefilterd.length; i++) {
      var obj = gefilterd[i];
      html += '<div class="object-kaart" onclick="detailTonen(\'' + obj.id + '\')">';
      html += '<img class="kaart-afbeelding" src="' + obj.afbeelding + '" alt="' + obj.naam + '">';
      html += '<div class="kaart-inhoud">';
      html += '<div class="kaart-naam">' + obj.naam + '</div>';
      html += '<div class="risico-badge risico-' + obj.risico + '">RISICO LEVEL: ' + obj.risico.toUpperCase() + '</div>';
      html += '<p class="kaart-beschrijving">' + obj.korteBeschrijving + '</p>';
      html += '<button class="kaart-knop">BEKIJK MEER</button>';
      html += '</div>';
      html += '</div>';
    }

    lijst.innerHTML = html;
  }

  // Filter toepassen
  function filterToepassen() {
    actieveFilters.risico = document.getElementById('filter-risico').value;
    actieveFilters.herkomst = document.getElementById('filter-herkomst').value;
    actieveFilters.verboden = document.getElementById('filter-verboden').value;
    lijstTonen();
  }

  // Filter resetten
  function filterResetten() {
    document.getElementById('filter-risico').value = '';
    document.getElementById('filter-herkomst').value = '';
    document.getElementById('filter-verboden').value = '';
    actieveFilters = { risico: '', herkomst: '', verboden: '' };
    lijstTonen();
  }

  // Detail pagina tonen
  function detailTonen(objectId) {
    var obj = null;
    for (var i = 0; i < objecten.length; i++) {
      if (objecten[i].id === objectId) {
        obj = objecten[i];
        break;
      }
    }
    if (!obj) return;

    var incidentHtml = '';
    for (var i = 0; i < obj.incidents.length; i++) {
      var inc = obj.incidents[i];
      incidentHtml += '<div class="incident-blok">';
      incidentHtml += '<div class="incident-titel">● ' + inc.titel + '</div>';
      incidentHtml += '<p class="incident-tekst">' + inc.tekst + '</p>';
      incidentHtml += '</div>';
    }

    var html = '';
    html += '<img class="detail-afbeelding" src="' + obj.afbeelding + '" alt="' + obj.naam + '">';
    html += '<div class="detail-inhoud">';
    html += '<div class="detail-naam">' + obj.naam + '</div>';
    html += '<div class="risico-badge risico-' + obj.risico + '" style="margin-top:10px">RISICO LEVEL: ' + obj.risico.toUpperCase() + '</div>';
    html += '<p class="detail-tekst">' + obj.beschrijving + '</p>';
    html += '<div class="detail-sectie">';
    html += '<div class="sectie-titel">Herkomst</div>';
    html += '<div class="sectie-inhoud">' + obj.herkomst.charAt(0).toUpperCase() + obj.herkomst.slice(1) + '</div>';
    html += '</div>';
    html += '<div class="detail-sectie">';
    html += '<div class="sectie-titel">Magische Eigenschappen</div>';
    html += '<div class="sectie-inhoud">' + obj.magischeEigenschappen + '</div>';
    html += '</div>';
    html += '<div class="detail-sectie">' + incidentHtml + '</div>';
    html += '<div class="detail-sectie">';
    html += '<div class="waarschuwing-blok">';
    html += '<div class="waarschuwing-titel">⚠ Waarschuwing</div>';
    html += '<p class="waarschuwing-tekst">' + obj.waarschuwing + '</p>';
    html += '</div>';
    html += '</div>';
    html += '<button class="knop-ar" onclick="arOpenenMet(\'' + obj.id + '\')">▶ BEKIJK IN AR</button>';
    html += '</div>';

    document.getElementById('detail-inhoud').innerHTML = html;
    showPage('detail');
  }

  // AR openen met een specifiek object (vanuit detailpagina)
  function arOpenenMet(objectId) {
    window.location.href = 'ar.html?object=' + objectId;
  }

  // Modal sluiten
  function closeModal() {
    document.getElementById('fout-modal').classList.remove('zichtbaar');
  }

  function modalSluiten(event) {
    if (event.target === document.getElementById('fout-modal')) {
      closeModal();
    }
  }

  // Pagina opstarten
  lijstTonen();
