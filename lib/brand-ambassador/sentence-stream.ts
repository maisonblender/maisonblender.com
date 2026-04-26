/**
 * Sentence-boundary detection voor streaming TTS.
 *
 * Gebruikt tijdens SSE-streaming van de chat om zinnen naar TTS te sturen
 * ZODRA ze compleet zijn, ipv te wachten op het volledige antwoord. Zo
 * praat de Ambassador mee terwijl de tekst nog binnenkomt.
 *
 * Behoud:
 *  - Leestekens blijven bij de zin (natuurlijke prosody)
 *  - Aanhalingstekens en haakjes blijven bij het punt: "..." of )
 *  - Paragraph breaks (\n\n) zijn ook zinseinden
 *  - Heel korte "zinnen" (< 2 chars) worden genegeerd — meestal lijst-bullets of ruis
 */

/**
 * Splits nieuwe tekst sinds `fromIdx` op in complete zinnen + onthoudt
 * de cursor-positie tot waar we gelezen hebben. De resterende onvoltooide
 * zin blijft in de buffer tot een volgende delta 'm afmaakt.
 *
 * @param text Volledige tekst tot nu toe (cumulatief)
 * @param fromIdx Index waar we de vorige keer gestopt zijn
 * @returns Nieuwe complete zinnen + nieuwe cursorpositie
 */
export function extractCompleteSentences(
  text: string,
  fromIdx: number
): { sentences: string[]; nextIdx: number } {
  const remaining = text.slice(fromIdx);
  if (!remaining) return { sentences: [], nextIdx: fromIdx };

  const sentences: string[] = [];
  let cursor = 0;

  // Match einde-van-zin patronen:
  //  - Leesteken (. ! ? …) eventueel gevolgd door een quote/haakje, dan whitespace
  //  - OF een paragraph break (2+ newlines)
  //  - OF een enkele newline gevolgd door een bullet/nummering (nieuwe lijstitem)
  const re = /[.!?…]+["'”’)\]]*[\s\n]+|\n\n+|\n(?=[-•*\d])/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(remaining)) !== null) {
    const end = match.index + match[0].length;
    const sentence = remaining.slice(cursor, end).trim();
    if (sentence.length >= 2) {
      sentences.push(sentence);
    }
    cursor = end;
  }

  return { sentences, nextIdx: fromIdx + cursor };
}

/**
 * Flusht elke resterende onvoltooide tekst als laatste zin. Gebruikt bij
 * het "done" event zodat een kort antwoord zonder eindteken ("Bedankt")
 * óók nog uitgesproken wordt.
 */
export function flushRemainder(text: string, fromIdx: number): string | null {
  const remaining = text.slice(fromIdx).trim();
  return remaining.length >= 2 ? remaining : null;
}
