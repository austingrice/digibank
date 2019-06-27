import {DefaultCrudRepository} from '@loopback/repository';
import {Buy, BuyRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BuyRepository extends DefaultCrudRepository<
  Buy,
//  typeof Buy.prototype.issuer,
  BuyRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Buy, dataSource);
  }
}
