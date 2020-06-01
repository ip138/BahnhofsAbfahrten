import { extend } from 'umi-request';
import { parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import type { Element } from 'libxmljs2';
import type { Train } from 'types/iris';

export const noncdRequest = extend({
  prefix: 'https://iris.noncd.db.de/iris-tts/timetable',
});
export const openDataRequest = process.env.TIMETABLES_OPEN_DATA_KEY
  ? extend({
      prefix: 'https://api.deutschebahn.com/timetables/v1',
      headers: {
        Authorization: `Bearer ${process.env.TIMETABLES_OPEN_DATA_KEY}`,
      },
    })
  : noncdRequest;

export function getAttr(
  node: null | Element,
  name: string
): undefined | string {
  if (node) {
    const attr = node.attr(name);

    if (attr) {
      return attr.value();
    }
  }
}

export function getNumberAttr(
  node: null | Element,
  name: string
): undefined | number {
  const attr = getAttr(node, name);

  if (!attr) return undefined;

  return Number.parseInt(attr, 10);
}

export function getBoolAttr(node: null | Element, name: string): boolean {
  const attr = getAttr(node, name);

  if (!attr) return false;

  return attr === 'true';
}

export function parseTs(ts?: string): undefined | number {
  if (ts) {
    return zonedTimeToUtc(
      parse(ts, 'yyMMddHHmm', Date.now()),
      'Europe/Berlin'
    ).getTime();
  }
}

export function calculateVia(route: any, maxParts: number = 3) {
  const via: Train[] = [...route].filter((v) => !v.cancelled);

  via.pop();
  const important = via.filter((v) =>
    v.name.match(/(HB$|Hbf|Centraal|Flughafen)/)
  );

  const showing = [];

  if (important.length >= maxParts) {
    showing.push(via[0]);
  } else {
    showing.push(...via.splice(0, maxParts - important.length));
  }

  while (showing.length < maxParts && important.length) {
    const stop = important.shift()!;

    if (!showing.includes(stop)) {
      showing.push(stop);
    }
  }
  showing.forEach((v) => (v.showVia = true));
}