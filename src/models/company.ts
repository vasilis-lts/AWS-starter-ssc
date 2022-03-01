
import { Campaign } from './campaign';

export interface Company {
  companyId?: number;
  name?: string;
  campaigns?: Array<Campaign>;
}