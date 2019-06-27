import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Issue extends Entity {
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
  issueDateTime: string;

  @property({
    type: 'string',
    required: true,
  })
  maturityDateTime: string;

  @property({
    type: 'string',
    required: true,
  })
  faceValue: string;

  @property({
    type: 'string',
    required: true,
  })
  paperRate: string;

  constructor(data?: Partial<Issue>) {
    super(data);
  }
}

export interface IssueRelations {
  // describe navigational properties here
}

export type IssueWithRelations = Issue & IssueRelations;
