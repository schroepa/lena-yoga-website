/**
 * Mobiles Menü: öffnet und schließt den <dialog>.
 * Der Browser übernimmt Fokusfalle, Escape, inert-Hintergrund und Rückgabe des Fokus.
 */
const dialog = document.querySelector<HTMLDialogElement>('[data-menue]');
const oeffnen = document.querySelector<HTMLButtonElement>('[data-menue-oeffnen]');
const schliessen = document.querySelector<HTMLButtonElement>('[data-menue-schliessen]');

if (dialog && oeffnen && schliessen) {
  const desktop = window.matchMedia('(min-width: 48rem)');

  const setzeZustand = (offen: boolean): void => {
    oeffnen.setAttribute('aria-expanded', String(offen));
    document.documentElement.classList.toggle('menue-offen', offen);
  };

  oeffnen.addEventListener('click', () => {
    dialog.showModal();
    setzeZustand(true);
  });

  schliessen.addEventListener('click', () => {
    dialog.close();
  });

  // Auch bei Escape und bei jedem anderen Schließen den Zustand zurücksetzen.
  dialog.addEventListener('close', () => {
    setzeZustand(false);
  });

  // Ein Klick auf einen Link im Menü schließt es, bevor die neue Seite lädt (Zurück-Taste).
  dialog.addEventListener('click', (ereignis) => {
    if (ereignis.target instanceof Element && ereignis.target.closest('a')) dialog.close();
  });

  // Wird das Fenster breit genug, braucht es das Menü nicht mehr.
  desktop.addEventListener('change', (ereignis) => {
    if (ereignis.matches && dialog.open) dialog.close();
  });
}
