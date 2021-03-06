import { request } from './request';
import {
  StopPlaceKeyType,
  TransportType,
} from 'business-hub/types/RisStations';
import type {
  Platform,
  Platforms,
  StopPlace,
  StopPlaceKey,
  StopPlaceKeys,
  StopPlaces,
  StopPlaceSearchResult,
  StopPlaceSearchResults,
} from 'business-hub/types/RisStations';

const nonÖPNVTypes = [
  TransportType.HIGH_SPEED_TRAIN,
  TransportType.INTERCITY_TRAIN,
  TransportType.INTER_REGIONAL_TRAIN,
  TransportType.REGIONAL_TRAIN,
  TransportType.CITY_TRAIN,
];

function withoutÖPNV(stopPlace: StopPlaceSearchResult) {
  return stopPlace.availableTransports.some((t) => nonÖPNVTypes.includes(t));
}

export async function byName(
  searchTerm?: string,
  onlySPNV?: boolean,
): Promise<StopPlaceSearchResult[]> {
  if (!searchTerm) return [];
  const result = (
    await request.get<StopPlaceSearchResults>(
      `/ris-stations/v1/stop-places/by-name/${encodeURIComponent(searchTerm)}`,
    )
  ).data;
  if (onlySPNV) {
    return result.stopPlaces?.filter(withoutÖPNV) || [];
  }

  return result.stopPlaces || [];
}

export async function keys(evaNumber: string): Promise<StopPlaceKey[]> {
  return (
    await request.get<StopPlaceKeys>(
      `/ris-stations/v1/stop-places/${evaNumber}/keys`,
    )
  ).data.keys;
}

export async function byRl100(rl100: string): Promise<StopPlace | undefined> {
  try {
    const result = await request.get<StopPlaces>(
      '/ris-stations/v1/stop-places/by-key',
      {
        params: {
          key: rl100,
          keyType: StopPlaceKeyType.RL100,
        },
      },
    );
    return result.data.stopPlaces?.[0];
  } catch {
    return undefined;
  }
}

export async function byEva(evaNumber: string): Promise<StopPlace | undefined> {
  try {
    const result = (
      await request.get<StopPlaces>(`/ris-stations/v1/stop-places/${evaNumber}`)
    ).data;
    return result.stopPlaces?.[0];
  } catch {
    return undefined;
  }
}

export async function byPosition(
  latitude: number,
  longitude: number,
  radius: number,
): Promise<StopPlaceSearchResult[]> {
  try {
    const result = (
      await request.get<StopPlaceSearchResults>(
        '/ris-stations/v1/stop-places/by-position',
        {
          params: {
            longitude,
            latitude,
            radius,
          },
        },
      )
    ).data;
    return result.stopPlaces || [];
  } catch {
    return [];
  }
}

export async function platforms(evaNumber: string): Promise<Platform[]> {
  try {
    const result = (
      await request.get<Platforms>(`/ris-stations/v1/stop-places/platforms`, {
        params: {
          evaNumber,
          includeSubPlatforms: true,
          includeOperational: true,
          includeAccessibility: true,
        },
      })
    ).data;
    return result.platforms || [];
  } catch {
    return [];
  }
}
