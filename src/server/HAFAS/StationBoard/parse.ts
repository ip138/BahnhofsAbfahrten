import {
  CommonArrival,
  CommonDeparture,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import { Jny, StationBoardResponse } from 'types/HAFAS/StationBoard';
import { parse } from 'date-fns';
import { StationBoardEntry } from 'types/stationBoard';
import parseCommonArrival from '../helper/parseCommonArrival';
import parseCommonDeparture from '../helper/parseCommonDeparture';
import parseProduct from '../helper/parseProduct';

const isArrival = (a: CommonArrival | CommonDeparture): a is CommonArrival =>
  a.hasOwnProperty('aOutR');

const parseStationBoardResponse = (
  jny: Jny,
  common: ParsedCommon
): StationBoardEntry => {
  const date = parse(jny.date, 'yyyyMMdd', new Date()).getTime();
  const product = common.prodL[jny.prodX];
  const commonResponse = {
    train: parseProduct(product),
    currentStation: common.locL[jny.stbStop.locX],
    finalDestination: jny.dirTxt,
    jid: jny.jid,
    isCancelled: jny.isCncl,
    product: global.PROD ? undefined : product,
  };

  if (isArrival(jny.stbStop)) {
    return {
      ...commonResponse,
      arrival: parseCommonArrival(jny.stbStop, date),
    };
  }

  return {
    ...commonResponse,
    departure: parseCommonDeparture(jny.stbStop, date),
  };
};

export default (
  r: HafasResponse<StationBoardResponse>,
  parsedCommon: ParsedCommon
): StationBoardEntry[] => {
  // @ts-ignore ???
  const abfahrten: StationBoardEntry[] = r.svcResL[0].res.jnyL.map((j: Jny) =>
    parseStationBoardResponse(j, parsedCommon)
  );

  return abfahrten;
};