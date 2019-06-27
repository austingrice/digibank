import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Redeem extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  issuer: string;

  @property({
    type: 'string',
    required: true,
  })
  paperNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  redeemingOwner: string;

  @property({
    type: 'string',
    required: true,
  })
  redeemDateTime: string;


  constructor(data?: Partial<Redeem>) {
    super(data);
  }
}

export interface RedeemRelations {
  // describe navigational properties here
}

export type RedeemWithRelations = Redeem & RedeemRelations;
