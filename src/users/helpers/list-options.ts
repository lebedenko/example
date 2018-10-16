import { Query } from 'mongoose';

import { ListOptionsDto } from '../dto/list-options.dto';

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export class ListOptions {
  private dto: ListOptionsDto;

  get page(): number {
    return +this.dto.p || null;
  }

  get limit(): number {
    return this.dto.l ? Math.min(+this.dto.l, MAX_LIMIT) : DEFAULT_LIMIT;
  }

  get offset(): number {
    return this.page ? (this.page - 1) * this.limit : 0;
  }

  get order(): string {
    if (!this.dto.o) {
      return null;
    }
    return this.dto.o.split(',').join(' ');
  }

  get filter() {
    if (!this.dto.f) {
      return [];
    }

    return this.dto.f.split(',').map(i => i.split(':'));
  }

  constructor(dto: ListOptionsDto) {
    this.dto = dto;
  }

  applyFilters<T>(query: Query<T>): Query<T> {
    for (const item of this.filter) {
      query = query.where({ [item[0]]: item[1] });
    }

    return query;
  }
}
