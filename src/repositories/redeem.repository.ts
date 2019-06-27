import {DefaultCrudRepository} from '@loopback/repository';
import {Redeem, RedeemRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RedeemRepository extends DefaultCrudRepository<
  Redeem,
//  typeof Redeem.prototype.issuer,
  RedeemRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Redeem, dataSource);
  }
}
