
import { ShipmentTotals } from './shipmentTotals';

export interface Campaign {
  campaignId?: number;
  name?: string;
  companyId?: number;
  period?: string;
  isFrozen?: boolean;
  shipmentTotals?: ShipmentTotals;
}