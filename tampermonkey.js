// ==UserScript== im Browser
// @name          DSO Karten
// @namespace     http://tampermonkey.net/
// @version       2.0
// @description  Overlay mit Map-Auswahl, Panning, Zoom, Resize und Local Storage.
// @author        YourName (Adapted by AI)
// @match         https://www.diesiedleronline.de/de/spielen
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

    // *******************************************************************
    // ** ⚠️ KONFIGURATION ⚠️ **
    // *******************************************************************
    // Basis-URL Ihrer GitHub-Repo (Muss mit / enden, z.B. für "assets/maps/...")
    const BASE_MAP_URL = 'https://raw.githubusercontent.com/VolkanSah/DSO-Karten/refs/heads/main/';

    // JSON-Daten der Karten (als String)
    const MAP_JSON_STRING = `
    {
        "map_loader": [
            {"at_loader_name": "Aladin und die Öllampe", "at_img": "assets/maps/aladinunddieoellampe-Blank.jpg"},
            {"at_loader_name": "Ali Baba und der dritte Dieb", "at_img": "assets/maps/alibabaderdrittedieb-Blank.jpg"},
            {"at_loader_name": "Ali Baba und der erste Dieb", "at_img": "assets/maps/alibabadererstedieb-Blank.jpg"},
            {"at_loader_name": "Ali Baba, der junge Holzfäller", "at_img": "assets/maps/alibabaderjungeholzfaeller-Blank.jpg"},
            {"at_loader_name": "Ali Baba und der Schatz der Weisheit", "at_img": "assets/maps/alibabaderschatzderweisheit-Blank.jpg"},
            {"at_loader_name": "Ali Baba und der Schatz des Wissens", "at_img": "assets/maps/alibabaderschatzdeswissens-Blank.jpg"},
            {"at_loader_name": "Ali Baba und der zweite Dieb", "at_img": "assets/maps/alibabaderzweitedieb-Blank.jpg"},
            {"at_loader_name": "Alte Bekannte", "at_img": "assets/maps/altebekannte-Blank.jpg"},
            {"at_loader_name": "Alte Ruinen", "at_img": "assets/maps/alteruinen-Blank.jpg"},
            {"at_loader_name": "Am Fuße des Berges", "at_img": "assets/maps/amfussedesberges.jpg"},
            {"at_loader_name": "Angriff der Nordmänner", "at_img": "assets/maps/angriffedernordmaenner-Blank.jpg"},
            {"at_loader_name": "Belagerung", "at_img": "assets/maps/belagerung-Blank.jpg"},
            {"at_loader_name": "Bergvolk", "at_img": "assets/maps/bergvolk.jpg"},
            {"at_loader_name": "Beutelschneider", "at_img": "assets/maps/beutelschneider-Blank.jpg"},
            {"at_loader_name": "Bonaberti", "at_img": "assets/maps/bonaberti-blank.jpg"},
            {"at_loader_name": "Chupacabra", "at_img": "assets/maps/chupacabra-Blank.jpg"},
            {"at_loader_name": "Das betrogene Schneiderlein", "at_img": "assets/maps/dasbetrogeneschneiderlein-Blank.jpg"},
            {"at_loader_name": "Das heldenhafte Schneiderlein", "at_img": "assets/maps/dasheldenhafteschneiderlein-Blank.jpg"},
            {"at_loader_name": "Das kluge Schneiderlein", "at_img": "assets/maps/dasklugeschneiderlein-Blank.jpg"},
            {"at_loader_name": "Das tapfere Schneiderlein", "at_img": "assets/maps/dastapfereschneiderlein-Blank.jpg"},
            {"at_loader_name": "Der schlafende Vulkan", "at_img": "assets/maps/derschlafendevulkan-Blank.jpg"},
            {"at_loader_name": "Die schwarzen Priester", "at_img": "assets/maps/dieschwarzenpriester-Blank.jpg"},
            {"at_loader_name": "Dunkle Bruderschaft", "at_img": "assets/maps/dunklebruderschaft-Blank.jpg"},
            {"at_loader_name": "Einsame Experimente", "at_img": "assets/maps/einsameexperimente-Blank.jpg"},
            {"at_loader_name": "Fischer und Frau", "at_img": "assets/maps/fischerundfrau-Blank.jpg"},
            {"at_loader_name": "Garrun", "at_img": "assets/maps/garrun-Blank.jpg"},
            {"at_loader_name": "Gestohlener Schlitten", "at_img": "assets/maps/gestolenerschlitten-Blank.jpg"},
            {"at_loader_name": "Grabräuber", "at_img": "assets/maps/grabraeuber-Blank.jpg"},
            {"at_loader_name": "Hänsel und Gretel", "at_img": "assets/maps/haenselundgretel-Blank.jpg"},
            {"at_loader_name": "Insel der Freibeuter", "at_img": "assets/maps/inselderfreibeuter-Blank.jpg"},
            {"at_loader_name": "Invasion der Nordmänner", "at_img": "assets/maps/invasiondernordmaenner-Blank.jpg"},
            {"at_loader_name": "Jagd auf die Jäger", "at_img": "assets/maps/jagdaufdiejaeger-Blank.jpg"},
            {"at_loader_name": "Kopfgeldjäger", "at_img": "assets/maps/kopfgeld.jpg"},
            {"at_loader_name": "Labyrinth", "at_img": "assets/maps/labyrinth.jpg"},
            {"at_loader_name": "Lieder und Fluch", "at_img": "assets/maps/liederfluch-Blank.jpeg"},
            {"at_loader_name": "Mehr Einsame Experimente", "at_img": "assets/maps/mehreinsameexperimente-Blank.jpg"},
            {"at_loader_name": "Mutterliebe", "at_img": "assets/maps/mutterliebe-Blank.jpg"},
            {"at_loader_name": "Nordmänner", "at_img": "assets/maps/nordmaenner-Blank.jpg"},
            {"at_loader_name": "Quartier des Drachen", "at_img": "assets/maps/quartierdesdrachen-Blank.jpg"},
            {"at_loader_name": "Räuberbande", "at_img": "assets/maps/raeuberbande-Blank.jpg"},
            {"at_loader_name": "Räubernest", "at_img": "assets/maps/raeubernest-Blank.jpg"},
            {"at_loader_name": "Rasender Bulle", "at_img": "assets/maps/rasenderbulle-Blank.jpg"},
            {"at_loader_name": "Rattenfänger", "at_img": "assets/maps/rattenfaenger-Blank.jpg"},
            {"at_loader_name": "Regionen", "at_img": "assets/maps/regionen.jpg"},
            {"at_loader_name": "Rettet das Weihnachtsfest", "at_img": "assets/maps/rettetdasweichnachtsfest-Blank.jpg"},
            {"at_loader_name": "Riesenkampf", "at_img": "assets/maps/riesenkampf.jpg"},
            {"at_loader_name": "Rotkäppchen", "at_img": "assets/maps//rotkaeppchen_2025.jpg"},
            {"at_loader_name": "Rückkehr ins Räubernest", "at_img": "assets/maps/rueckkehrinsraeubernest-Blank.jpg"},
            {"at_loader_name": "Sattelfest", "at_img": "assets/maps/sattelfest-Blank.jpg"},
            {"at_loader_name": "Schießpulver", "at_img": "assets/maps/schiesspulver-Blank.jpg"},
            {"at_loader_name": "Schneewittchen", "at_img": "assets/maps/schneewittchen-Blank.jpg"},
            {"at_loader_name": "Schritt voraus", "at_img": "assets/maps/schrittvoraus-Blank.jpg"},
            {"at_loader_name": "Schwarzen Ritter", "at_img": "assets/maps/schwarzenritter-Blank.jpg"},
            {"at_loader_name": "Seeuferschatz", "at_img": "assets/maps/seeuferschatz-Blank.jpg"},
            {"at_loader_name": "Shamane", "at_img": "assets/maps/shamane-Blank.jpg"},
            {"at_loader_name": "Sindbad die belagerte Stadt", "at_img": "assets/maps/sindbaddiebelagertestadt-Blank.jpg"},
            {"at_loader_name": "Sindbad die Seeschlange", "at_img": "assets/maps/sindbaddieseeschlange-Blank.jpg"},
            {"at_loader_name": "Söhne der Steppe", "at_img": "assets/maps/soehnedersteppe-Blank.jpg"},
            {"at_loader_name": "Söhne des Schneiderlein", "at_img": "assets/maps/soehnedesschneiderlein-Blank.jpg"},
            {"at_loader_name": "Der Kornzwist", "at_img": "assets/maps/der-kornzwist.jpg"},
            {"at_loader_name": "Schätze der Berge", "at_img": "assets/maps/schaetze-der-berge.jpg"},
            {"at_loader_name": "Die Karte des Narren", "at_img": "assets/maps/die-karte-des-narren.jpg"},
            {"at_loader_name": "Eine neue Erfahrung", "at_img": "assets/maps/eine-neue-erfahrung.jpg"},
            {"at_loader_name": "Held gesucht", "at_img": "assets/maps/held-gesucht.jpg"},
            {"at_loader_name": "Herz des Waldes", "at_img": "assets/maps/herz-des-waldes.jpg"},
            {"at_loader_name": "nichts besonderes", "at_img": "assets/maps/nichts-besonderes.jpg"},
            {"at_loader_name": "Retro Stil", "at_img": "assets/maps/retro-stil.jpg"},
            {"at_loader_name": "Sturmhilfe", "at_img": "assets/maps/sturmhilfe.jpg"},
            {"at_loader_name": "Woher kommen die Ostereier", "at_img": "assets/maps/woher-kommen-die-ostereier.jpg"},
            {"at_loader_name": "Zwillinge", "at_img": "assets/maps/zwillinge.jpg"},
            {"at_loader_name": "Übungsspiel", "at_img": "assets/maps/uebungsspiel.jpg"},
            {"at_loader_name": "Finale", "at_img": "assets/maps/finale.jpg"},
            {"at_loader_name": "Halbfinale", "at_img": "assets/maps/halbfinale.jpg"},
            {"at_loader_name": "Viertelfinale", "at_img": "assets/maps/viertelfinale.jpg"},
            {"at_loader_name": "Achtelfinale", "at_img": "assets/maps/achtelfinale.jpg"},
            {"at_loader_name": "Das betrogene Schneiderlein", "at_img": "assets/maps/das-betrogene-schneiderlein.jpg"},
            {"at_loader_name": "Arktische Explosion", "at_img": "assets/maps/arktische-explosion.jpg"},
            {"at_loader_name": "Der schlafende Vulkan", "at_img": "assets/maps/der-schlafende-vulkan.jpg"},
            {"at_loader_name": "Der verschollene Schädel", "at_img": "assets/maps/der-verschollene-schaedel.jpg"},
            {"at_loader_name": "Die schwarzen Priester", "at_img": "assets/maps/die-schwarzen-priester.jpg"},
            {"at_loader_name": "Gefängnisinsel", "at_img": "assets/maps/gefaengnisinsel.jpg"},
            {"at_loader_name": "Piratenleben", "at_img": "assets/maps/piratenleben.jpg"},
            {"at_loader_name": "Schlummerndes Riff", "at_img": "assets/maps/schlummerndes-riff.jpg"},
            {"at_loader_name": "Tikki-Insel", "at_img": "assets/maps/tikki-insel.jpg"},
            {"at_loader_name": "Tropensonne", "at_img": "assets/maps/tropensonne.jpg"},
            {"at_loader_name": "Die Belagerung", "at_img": "assets/maps/die-belagerung.jpg"},
            {"at_loader_name": "Die Freibeuter-Razzia", "at_img": "assets/maps/die-freibeuter-razzia.jpg"},
            {"at_loader_name": "Geteilte Stadt im Herbst", "at_img": "assets/maps/geteilte-stadt-im-herbst.jpg"},
            {"at_loader_name": "Geteilte Stadt im Sommer", "at_img": "assets/maps/geteilte-stadt-im-sommer.jpg"},
            {"at_loader_name": "Grabräuber", "at_img": "assets/maps/grabraeuber.jpg"},
            {"at_loader_name": "Jagd auf die Jäger", "at_img": "assets/maps/jagd-auf-die-jaeger.jpg"},
            {"at_loader_name": "Seeufer-Schatz", "at_img": "assets/maps/seeufer-schatz.jpg"},
            {"at_loader_name": "Der Wirbelwind", "at_img": "assets/maps/der-wirbelwind.jpg"}
        ]
    }`;

    const MAP_DATA = JSON.parse(MAP_JSON_STRING).map_loader;

    // *******************************************************************
    // ** HTML-STRUKTUR **
    // *******************************************************************
    const html = `
        <div id="community-overlay">
            <div id="overlay-resize-handle"></div>
            <div id="overlay-header">
                <div class="header-left">
                    <span class="overlay-title">Taktikkarte Viewer</span>
                    <span class="overlay-version">v2.0</span>
                </div>
                <div class="header-right">
                    <button id="overlay-reset-map" title="Zoom und Position zurücksetzen">⟳</button>
                    <button id="overlay-minimize" title="Minimieren">_</button>
                    <button id="overlay-close" title="Schließen">×</button>
                </div>
            </div>
            <div id="overlay-content">
                <div class="map-controls">
                    <label for="map-selector">Karte:</label>
                    <select id="map-selector"></select>
                </div>
                <div id="map-container">
                    <img id="tactic-map" src="" alt="Taktikkarte" title="Mausrad: Zoom, Ziehen: Verschieben">
                </div>
            </div>
        </div>
    `;

    // *******************************************************************
    // ** CSS-STILE **
    // *******************************************************************
    const css = `
        #community-overlay {
            position: fixed;
            top: 50px;
            right: 50px;
            width: 450px;
            height: 650px;
            min-width: 300px;
            min-height: 200px;
            resize: none;
            overflow: hidden;
            background: rgba(32, 34, 37, 0.98);
            border: 1px solid #40444b;
            border-radius: 8px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
            color: #dcddde;
            font-family: Arial, sans-serif;
            z-index: 9999;
            user-select: none;
            touch-action: none;
            display: flex;
            flex-direction: column;
        }

        #overlay-resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            background: transparent;
            cursor: nwse-resize;
            z-index: 10000;
        }

        #overlay-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #2f3136;
            border-bottom: 1px solid #40444b;
            border-radius: 8px 8px 0 0;
            cursor: move;
            flex-shrink: 0;
        }

        .header-left, .header-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .overlay-title { font-weight: bold; color: #ffffff; }
        .overlay-version { font-size: 0.8em; color: #72767d; }

        .header-right button {
            background: none; border: none; color: #72767d; cursor: pointer;
            padding: 2px 6px; font-size: 16px; border-radius: 3px;
            line-height: 1;
        }
        .header-right button:hover { background: #40444b; color: #ffffff; }

        #overlay-content {
            padding: 10px;
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .map-controls {
            padding-bottom: 8px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #map-selector {
            padding: 4px;
            border-radius: 4px;
            background: #2f3136;
            color: #dcddde;
            border: 1px solid #40444b;
            flex-grow: 1;
        }

        #map-container {
            flex-grow: 1;
            overflow: hidden;
            cursor: grab;
            border: 1px solid #40444b;
            background-color: #1e1e1e;
        }

        #map-container:active { cursor: grabbing; }

        #tactic-map {
            display: block;
            min-width: 100%;
            min-height: 100%;
            transform-origin: 0 0;
            transition: none;
            pointer-events: none; /* Wichtig, damit mousedown/mousemove Events an den Container gehen */
        }
    `;

    // *******************************************************************
    // ** JAVASCRIPT LOGIK **
    // *******************************************************************

    function initializeOverlay() {
        // --- Setup ---
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);

        const overlayContainer = document.createElement('div');
        overlayContainer.innerHTML = html;
        document.body.appendChild(overlayContainer);

        // --- DOM Elemente abrufen ---
        const overlay = document.getElementById('community-overlay');
        const header = document.getElementById('overlay-header');
        const minimizeBtn = document.getElementById('overlay-minimize');
        const closeBtn = document.getElementById('overlay-close');
        const resetMapBtn = document.getElementById('overlay-reset-map');
        const content = document.getElementById('overlay-content');
        const resizeHandle = document.getElementById('overlay-resize-handle');
        const mapContainer = document.getElementById('map-container');
        const tacticMap = document.getElementById('tactic-map');
        const mapSelector = document.getElementById('map-selector');


        // --- Event Isolation Helper ---
        function preventEventBubbling(e) {
            e.stopPropagation();
        }

        // --- Zustandsvariablen ---
        let mapState = {
            x: parseFloat(localStorage.getItem('mapX') || '0'),
            y: parseFloat(localStorage.getItem('mapY') || '0'),
            zoom: parseFloat(localStorage.getItem('mapZoom') || '1.0'),
            selectedMap: localStorage.getItem('selectedMap') || MAP_DATA[0].at_img
        };

        let isOverlayDragging = false;
        let isResizing = false;
        let isMapDragging = false;
        let mapInitialX, mapInitialY;

        let overlayCurrentX = parseInt(localStorage.getItem('overlayX') || '0');
        let overlayCurrentY = parseInt(localStorage.getItem('overlayY') || '0');
        let overlayCurrentW = parseInt(localStorage.getItem('overlayW') || '450');
        let overlayCurrentH = parseInt(localStorage.getItem('overlayH') || '650');

        let initialX, initialY, initialW, initialH;

        // Initial position & size setzen
        overlay.style.transform = `translate3d(${overlayCurrentX}px, ${overlayCurrentY}px, 0)`;
        overlay.style.width = `${overlayCurrentW}px`;
        overlay.style.height = `${overlayCurrentH}px`;

        // --- Local Storage Funktionen ---

        function saveMapState() {
             localStorage.setItem('mapX', mapState.x.toString());
             localStorage.setItem('mapY', mapState.y.toString());
             localStorage.setItem('mapZoom', mapState.zoom.toString());
             localStorage.setItem('selectedMap', mapState.selectedMap);
        }

        function applyMapTransform() {
            // Skalierung und Verschiebung werden kombiniert. Wichtig: Die Übersetzung (x/y) muss durch den Zoom-Faktor geteilt werden,
            // da die Skalierung bereits auf die Verschiebung angewendet wird.
            tacticMap.style.transform = `scale(${mapState.zoom}) translate3d(${mapState.x / mapState.zoom}px, ${mapState.y / mapState.zoom}px, 0)`;
        }

        // --- Map Lade- und Steuerungslogik ---

        function resetMapPosition(resetZoom = false) {
             mapState.x = 0;
             mapState.y = 0;
             if (resetZoom) mapState.zoom = 1.0;
             applyMapTransform();
             saveMapState();
        }

        function populateMapSelector() {
            MAP_DATA.forEach(map => {
                const option = document.createElement('option');
                option.value = map.at_img;
                option.textContent = map.at_loader_name;
                mapSelector.appendChild(option);
            });

            // Initialen Zustand setzen
            mapSelector.value = mapState.selectedMap;
            loadSelectedMap(false); // Beim Start nicht zurücksetzen
        }

        function loadSelectedMap(reset = true) {
            const currentSelected = mapSelector.value;

            // Wenn die Karte gewechselt wird UND reset = true ist, Pan/Zoom zurücksetzen
            if (mapState.selectedMap !== currentSelected && reset) {
                resetMapPosition(true);
            } else {
                applyMapTransform();
            }

            mapState.selectedMap = currentSelected;
            tacticMap.src = BASE_MAP_URL + mapState.selectedMap;
            saveMapState();
        }

        // --- Pan (Drag Karte) Logik ---

        function startMapDragging(e) {
            if (e.button !== 0) return;

            e.preventDefault();
            e.stopPropagation();

            isMapDragging = true;
            mapInitialX = e.clientX - mapState.x;
            mapInitialY = e.clientY - mapState.y;
            mapContainer.style.cursor = 'grabbing';
        }

        function applyMapBounds(newX, newY) {
            const containerW = mapContainer.clientWidth;
            const containerH = mapContainer.clientHeight;
            // Bildgröße nach Zoom
            const mapW = tacticMap.naturalWidth * mapState.zoom;
            const mapH = tacticMap.naturalHeight * mapState.zoom;

            // X-Achse begrenzen: Verschiebung darf maximal 0 sein und minimal (Containerbreite - Bildbreite)
            const maxX = 0;
            const minX = Math.min(0, containerW - mapW);
            mapState.x = Math.max(Math.min(newX, maxX), minX);

            // Y-Achse begrenzen
            const maxY = 0;
            const minY = Math.min(0, containerH - mapH);
            mapState.y = Math.max(Math.min(newY, maxY), minY);
        }

        function dragMap(e) {
            if (!isMapDragging) return;

            e.preventDefault();
            e.stopPropagation();

            let newX = e.clientX - mapInitialX;
            let newY = e.clientY - mapInitialY;

            applyMapBounds(newX, newY);
            applyMapTransform();
        }

        function stopMapDragging() {
            if (isMapDragging) {
                isMapDragging = false;
                mapContainer.style.cursor = 'grab';
                saveMapState();
            }
        }

        // --- Zoom Logik ---

        function handleMapZoom(e) {
            preventEventBubbling(e);
            e.preventDefault();

            const zoomDelta = e.deltaY * -0.001;
            const oldZoom = mapState.zoom;

            // Neuen Zoom berechnen und begrenzen (Min 0.1, Max 5.0)
            mapState.zoom = Math.max(0.1, Math.min(5.0, oldZoom + zoomDelta));

            // Zoom-Fokus auf Mausposition beibehalten
            const containerRect = mapContainer.getBoundingClientRect();
            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;

            // Pan-Korrektur
            mapState.x = mouseX - (mouseX - mapState.x) * (mapState.zoom / oldZoom);
            mapState.y = mouseY - (mouseY - mapState.y) * (mapState.zoom / oldZoom);

            // Nach dem Zoomen Begrenzungen erneut anwenden
            applyMapBounds(mapState.x, mapState.y);

            applyMapTransform();
            saveMapState();
        }

        // --- Overlay Drag Logik ---

        function startOverlayDragging(e) {
            preventEventBubbling(e);
            if (e.target === header || (e.target.closest('#overlay-header') && !e.target.closest('.header-right'))) {
                 if (!isMapDragging && !isResizing) {
                    isOverlayDragging = true;
                    initialX = e.clientX - overlayCurrentX;
                    initialY = e.clientY - overlayCurrentY;
                }
            }
        }

        function dragOverlay(e) {
            if (isOverlayDragging) {
                preventEventBubbling(e);

                overlayCurrentX = e.clientX - initialX;
                overlayCurrentY = e.clientY - initialY;

                overlay.style.transform = `translate3d(${overlayCurrentX}px, ${overlayCurrentY}px, 0)`;
            }
        }

        function stopOverlayDragging(e) {
            if (isOverlayDragging) {
                preventEventBubbling(e);
                isOverlayDragging = false;
                localStorage.setItem('overlayX', overlayCurrentX.toString());
                localStorage.setItem('overlayY', overlayCurrentY.toString());
            }
        }

        // --- Resize Logik ---

        function startResizing(e) {
            preventEventBubbling(e);
            isResizing = true;
            initialX = e.clientX;
            initialY = e.clientY;
            initialW = overlay.clientWidth;
            initialH = overlay.clientHeight;
        }

        function handleResizing(e) {
             if (isResizing) {
                preventEventBubbling(e);
                const dx = e.clientX - initialX;
                const dy = e.clientY - initialY;

                overlayCurrentW = Math.max(300, initialW + dx);
                overlayCurrentH = Math.max(200, initialH + dy);

                overlay.style.width = `${overlayCurrentW}px`;
                overlay.style.height = `${overlayCurrentH}px`;

                // Wichtig: Begrenzungen der Karte nach Resize neu berechnen
                applyMapBounds(mapState.x, mapState.y);
                applyMapTransform();
            } else if (isOverlayDragging) {
                dragOverlay(e);
            } else if (isMapDragging) {
                dragMap(e);
            }
        }

        function stopResizingOrDragging(e) {
             if (isResizing) {
                preventEventBubbling(e);
                isResizing = false;
                localStorage.setItem('overlayW', overlayCurrentW.toString());
                localStorage.setItem('overlayH', overlayCurrentH.toString());
            } else if (isOverlayDragging) {
                stopOverlayDragging(e);
            } else if (isMapDragging) {
                stopMapDragging();
            }
        }

        // --- Event Listener Registrierung ---

        // Overlay Events
        header.addEventListener('mousedown', startOverlayDragging, { passive: false });
        resizeHandle.addEventListener('mousedown', startResizing, { passive: false });
        document.addEventListener('mousemove', handleResizing, { passive: false });
        document.addEventListener('mouseup', stopResizingOrDragging, { passive: false });

        // Map Events
        mapContainer.addEventListener('mousedown', startMapDragging, { passive: false });
        mapContainer.addEventListener('wheel', handleMapZoom, { passive: false });
        resetMapBtn.addEventListener('click', (e) => {
             preventEventBubbling(e);
             resetMapPosition(true);
        });
        mapSelector.addEventListener('change', () => loadSelectedMap(true));

        // UI Events
        let isMinimized = false;
        minimizeBtn.addEventListener('click', (e) => {
            preventEventBubbling(e);
            isMinimized = !isMinimized;
            content.style.display = isMinimized ? 'none' : 'flex';
            overlay.style.height = isMinimized ? '40px' : `${overlayCurrentH}px`;
            minimizeBtn.textContent = isMinimized ? '□' : '_';
        });

        closeBtn.addEventListener('click', (e) => {
            preventEventBubbling(e);
            overlay.remove();
            // Aufräumen des Local Storage
            ['overlayX', 'overlayY', 'overlayW', 'overlayH', 'mapX', 'mapY', 'mapZoom', 'selectedMap'].forEach(key => localStorage.removeItem(key));
        });

        // Global Event Prevention
        overlay.addEventListener('mousedown', preventEventBubbling, { passive: false });
        overlay.addEventListener('selectstart', preventEventBubbling, { passive: false });
        overlay.addEventListener('dragstart', preventEventBubbling, { passive: false });


        // ** START DER ANWENDUNG **
        populateMapSelector();
        // Initiales Anwenden der Begrenzungen, falls die gespeicherte Position außerhalb liegt
        applyMapBounds(mapState.x, mapState.y);
        applyMapTransform();
    }

    // Overlay starten
    initializeOverlay();
})();
