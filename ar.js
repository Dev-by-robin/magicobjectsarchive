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
    ]
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
    ]
  }
];

// Kleine debounce zodat het paneel niet flikkert bij het langs bewegen
var toonTimer = null;

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

// Luister naar raycaster events op de camera (werkt op iOS)
document.querySelector('a-scene').addEventListener('loaded', function() {
  var camera = document.querySelector('[camera]');

  camera.addEventListener('raycaster-intersection', function(evt) {
    var geraakt = evt.detail.els[0];
    var objectId = geraakt.id === 'obj-thing' ? 'thing' : 'crystal-ball';

    // Wacht 300ms voor tonen – voorkomt flikkering bij snel bewegen
    clearTimeout(toonTimer);
    toonTimer = setTimeout(function() {
      toonPaneel(objectId);
    }, 300);
  });

  camera.addEventListener('raycaster-intersection-cleared', function() {
    clearTimeout(toonTimer);
    // Paneel blijft open zodat de gebruiker het kan lezen
    // Sluit alleen via de X knop
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

  // Niet opnieuw opbouwen als dit object al open is
  if (document.getElementById('ar-paneel').dataset.huidig === objectId) return;

  document.getElementById('ar-instructie').style.display = 'none';

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
    + '<div class="ar-detail-blok">' + incidentHtml + '</div>';
}

function sluitPaneel() {
  var paneel = document.getElementById('ar-paneel');
  paneel.style.display = 'none';
  paneel.dataset.huidig = '';
  document.getElementById('ar-instructie').style.display = 'block';
}
