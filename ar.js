var objecten = [
  {
    id: 'thing',
    naam: 'THING',
    risico: 'hoog',
    herkomst: 'Onbekend',
    magischeEigenschappen: 'Levende hand zonder lichaam',
    beschrijving: 'Thing is een levende hand binnen het archief. Oorspronkelijk was Thing de hand van Isaac Night, een voormalige student van Nevermore Academy. Tijdens een ongeluk met een gevaarlijke machine werd zijn hand afgehakt. Door een elektrische ontlading kwam de hand vervolgens tot leven.',
    incidents: [
      {
        titel: 'Incidenten Log #001',
        tekst: 'Thing werd tijdelijk opnieuw vastgemaakt aan zijn oorspronkelijke eigenaar Isaac Night. Tijdens dit incident viel alle communicatie met het object volledig weg. Uiteindelijk wist Thing zichzelf los te maken en Isaac Night uit te schakelen door zijn mechanische hart te verwijderen.'
      }
    ],
    verboden: 'ja',
    waarschuwing: 'Het is nog niet volledig onderzocht of herinneringen of bewustzijn van Isaac Night nog aanwezig zijn binnen het object.'
  },
  {
    id: 'crystal-ball',
    naam: 'CRYSTAL BALL',
    risico: 'medium',
    herkomst: 'Addams Familie',
    magischeEigenschappen: 'Magische communicatie over grote afstanden',
    beschrijving: 'De Crystal Ball is een magisch object binnen het archief dat gebruikt wordt voor communicatie over grote afstanden. Het object werd oorspronkelijk door Morticia Addams aan Wednesday gegeven bij haar aankomst op Nevermore Academy.',
    incidents: [
      {
        titel: 'Incidenten Log #001',
        tekst: 'Tijdens haar eerste avond op Nevermore Academy gebruikte Wednesday de Crystal Ball om haar ouders te vertellen over meerdere gevaarlijke gebeurtenissen, waaronder twee bijna-doodervaringen, een monster en de mogelijkheid dat zij verantwoordelijk zou zijn voor de vernietiging van Nevermore.'
      }
    ],
    verboden: 'nee',
    waarschuwing: 'Gebruik van de Crystal Ball tijdens psychische uitputting wordt afgeraden. Dit kan leiden tot aanvallen en een verdere verslechtering van de mentale toestand van de gebruiker.'
  }
];

var toonTimer = null;

// Bewegingsknoppen
var beweging = {};
var bewegingInterval = null;
var bewegingSnelheid = 0.08;

function startBeweging(richting) {
  beweging[richting] = true;
  if (!bewegingInterval) {
    bewegingInterval = setInterval(beweeg, 16);
  }
}

function stopBeweging(richting) {
  delete beweging[richting];
  if (Object.keys(beweging).length === 0) {
    clearInterval(bewegingInterval);
    bewegingInterval = null;
  }
}

function beweeg() {
  var camEl = document.querySelector('[camera]');
  if (!camEl) return;

  var pos = camEl.getAttribute('position');
  var voorwaarts = new THREE.Vector3();
  camEl.object3D.getWorldDirection(voorwaarts);
  voorwaarts.y = 0;
  voorwaarts.normalize();

  var rechts = new THREE.Vector3();
  rechts.crossVectors(voorwaarts, new THREE.Vector3(0, 1, 0)).normalize();

  if (beweging.voor)   { pos.x -= voorwaarts.x * bewegingSnelheid; pos.z -= voorwaarts.z * bewegingSnelheid; }
  if (beweging.achter) { pos.x += voorwaarts.x * bewegingSnelheid; pos.z += voorwaarts.z * bewegingSnelheid; }
  if (beweging.links)  { pos.x += rechts.x * bewegingSnelheid; pos.z += rechts.z * bewegingSnelheid; }
  if (beweging.rechts) { pos.x -= rechts.x * bewegingSnelheid; pos.z -= rechts.z * bewegingSnelheid; }

  camEl.setAttribute('position', pos);
}

// iOS: vraag gyroscoop permissie
function vraagOrientatie() {
  DeviceOrientationEvent.requestPermission()
    .then(function(staat) {
      if (staat === 'granted') {
        document.getElementById('orientatie-permissie').style.display = 'none';
      }
    })
    .catch(function(err) {
      console.error('Orientatie permissie geweigerd:', err);
    });
}

window.addEventListener('load', function() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.getElementById('orientatie-permissie').style.display = 'flex';
  }
});

document.querySelector('a-scene').addEventListener('loaded', function() {
  var laadScherm = document.getElementById('ar-laad-scherm');
  laadScherm.classList.add('verborgen');
  setTimeout(function() { laadScherm.style.display = 'none'; }, 700);

  var camera = document.querySelector('[camera]');

  var gehovenObject = null;
  var hint = document.getElementById('ar-tik-hint');

  camera.addEventListener('raycaster-intersection', function(evt) {
    var geraakt = evt.detail.els[0];
    var objectId = null;
    var el = geraakt;
    while (el) {
      if (el.id === 'obj-thing')   { objectId = 'thing'; break; }
      if (el.id === 'obj-crystal') { objectId = 'crystal-ball'; break; }
      el = el.parentElement;
    }
    if (!objectId) return;
    gehovenObject = objectId;
    hint.style.display = 'block';
  });

  camera.addEventListener('raycaster-intersection-cleared', function() {
    gehovenObject = null;
    hint.style.display = 'none';
  });

  document.querySelector('a-scene').addEventListener('click', function() {
    if (gehovenObject && document.getElementById('ar-paneel').style.display === 'none') {
      toonPaneel(gehovenObject);
    }
  });

  // Object meegegeven via URL (?object=thing)
  var params = new URLSearchParams(window.location.search);
  var objectParam = params.get('object');
  if (objectParam) {
    toonPaneel(objectParam);
  }
});

function toonPaneel(objectId) {
  var obj = null;
  for (var i = 0; i < objecten.length; i++) {
    if (objecten[i].id === objectId) { obj = objecten[i]; break; }
  }
  if (!obj) return;

  // Niet opnieuw opbouwen als dit object al open staat
  if (document.getElementById('ar-paneel').dataset.huidig === objectId) return;

  document.getElementById('ar-instructie').style.display = 'none';
  document.querySelector('.ar-beweging').style.display = 'none';

  var incidentHtml = '';
  for (var i = 0; i < obj.incidents.length; i++) {
    var inc = obj.incidents[i];
    incidentHtml += '<div class="ar-incident-blok">';
    incidentHtml += '<div class="ar-incident-label">● ' + inc.titel + '</div>';
    incidentHtml += '<p class="ar-incident-tekst">' + inc.tekst + '</p>';
    incidentHtml += '</div>';
  }

  var paneel = document.getElementById('ar-paneel');
  paneel.dataset.huidig = objectId;
  paneel.style.display = 'block';
  paneel.innerHTML =
    '<button class="ar-paneel-sluit" onclick="sluitPaneel()">✕</button>'
    + '<div class="ar-object-naam">' + obj.naam + '</div>'
    + '<div class="ar-object-sub">OBJECT #' + obj.id.toUpperCase() + '</div>'
    + '<div class="risico-badge risico-' + obj.risico + '" style="margin-top:8px">RISICO LEVEL: ' + obj.risico.toUpperCase() + '</div>'
    + '<p class="ar-beschrijving">' + obj.beschrijving + '</p>'
    + '<div class="ar-detail-blok">'
    + '<div class="ar-detail-label">Herkomst</div>'
    + '<div class="ar-detail-waarde">' + obj.herkomst + '</div>'
    + '</div>'
    + '<div class="ar-detail-blok">'
    + '<div class="ar-detail-label">Magische Eigenschappen</div>'
    + '<div class="ar-detail-waarde">' + obj.magischeEigenschappen + '</div>'
    + '</div>'
    + '<div class="ar-detail-blok">' + incidentHtml + '</div>'
    + '<div class="ar-detail-blok">'
    + '<div class="ar-detail-label">Verboden</div>'
    + '<div class="ar-detail-waarde">' + obj.verboden.charAt(0).toUpperCase() + obj.verboden.slice(1) + '</div>'
    + '</div>'
    + '<div class="ar-waarschuwing-blok">'
    + '<div class="ar-waarschuwing-titel">⚠ Waarschuwing</div>'
    + '<p class="ar-waarschuwing-tekst">' + obj.waarschuwing + '</p>'
    + '</div>';
}

function sluitPaneel() {
  var paneel = document.getElementById('ar-paneel');
  paneel.style.display = 'none';
  paneel.dataset.huidig = '';
  document.getElementById('ar-instructie').style.display = 'block';
  document.querySelector('.ar-beweging').style.display = 'flex';
}
