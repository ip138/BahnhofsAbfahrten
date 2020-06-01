import { logger } from 'server/logger';
import request from 'umi-request';
import type { ParsedProduct } from 'types/HAFAS';
import type { PlannedSequence } from 'types/planReihung';

const planWRUrl = 'https://lib.finalrewind.org/dbdb/ice_type.json';

let planWRMap: {
  [key: string]: PlannedSequence;
} = {};

async function fetchPlanWR() {
  try {
    logger.debug('Fetching planWR');
    planWRMap = await request.get<typeof planWRMap>(planWRUrl);
    logger.debug('Fetched planWR');
  } catch (e) {
    logger.error(e, 'Fetching planWR failed');
  }
}

if (process.env.NODE_ENV !== 'test') {
  fetchPlanWR();
  setInterval(fetchPlanWR, 8 * 60 * 1000 * 60);
}

const allowedPlannedProductTypes = ['IC', 'ICE', 'EC', 'ECE'];

export const getPlannedSequence = (
  product: ParsedProduct
): PlannedSequence | undefined => {
  if (
    !product.number ||
    !allowedPlannedProductTypes.includes(product.type!) ||
    !product.admin?.startsWith('80')
  )
    return;

  return planWRMap[product.number];
};