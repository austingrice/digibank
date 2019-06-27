import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Buy extends Entity {
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
  currentOwner: string;

  @property({
    type: 'string',
    required: true,
  })
  newOwner: string;

  @property({
    type: 'string',
    required: true,
  })
  price: string;

  @property({
    type: 'string',
    required: true,
  })
  purchaseDateTime: string;


  constructor(data?: Partial<Buy>) {
    super(data);
  }
}

export interface BuyRelations {
  // describe navigational properties here
}

export type BuyWithRelations = Buy & BuyRelations;
