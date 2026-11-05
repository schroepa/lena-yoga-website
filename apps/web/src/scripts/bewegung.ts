/**
 * Bewegung: Abschnitte blenden beim Scrollen sanft ein, Fotos wandern leicht gegen den Text.
 * - [data-reveal]: dieses Element blendet ein. [data-reveal-gruppe]: die Kinder blenden nacheinander ein.
 * - [data-parallax]: das Bild darin verschiebt sich leicht, während der Rahmen durchs Fenster läuft.
 * Wer "weniger Bewegung" eingestellt hat, bekommt nichts davon (die Klasse "bewegung" wird dann
 * gar nicht erst gesetzt, siehe Base.astro), und ohne JavaScript bleibt alles sichtbar.
 */
import { animate } from 'motion/mini';
import { inView, scroll } from 'motion';

const wurzel = document.documentElement;

if (wurzel.classList.contains('bewegung')) {
  wurzel.classList.add('bewegung-bereit');
  const dauer = 0.7;
  const ease = [0.22, 1, 0.36, 1] as const; // sanft abbremsen

  const ziele = new Set<HTMLElement>(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  for (const gruppe of document.querySelectorAll('[data-reveal-gruppe]')) {
    for (const kind of gruppe.children) {
      if (kind instanceof HTMLElement) ziele.add(kind);
    }
  }

  for (const ziel of ziele) {
    // Reihenfolge unter Geschwistern, die zusammen sichtbar werden: gestaffelter Einsatz.
    const geschwister = ziel.parentElement
      ? [...ziel.parentElement.children].filter((e) => ziele.has(e as HTMLElement))
      : [ziel];
    const verzoegerung = Math.min(geschwister.indexOf(ziel), 4) * 0.12;

    inView(
      ziel,
      () => {
        ziel.dataset['sichtbar'] = '';
        animate(
          ziel,
          { opacity: [0, 1], transform: ['translateY(1.5rem)', 'translateY(0)'] },
          { duration: dauer, delay: verzoegerung, ease },
        );
      },
      { amount: 0.15 },
    );
  }

  for (const rahmen of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
    const bild = rahmen.querySelector('img');
    if (!bild) continue;
    scroll(
      animate(bild, { transform: ['translateY(-7%)', 'translateY(7%)'] }, { ease: 'linear' }),
      {
        target: rahmen,
        offset: ['start end', 'end start'],
      },
    );
  }
}
