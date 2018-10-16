import { IsOptional } from 'class-validator';

export class ListOptionsDto {
  @IsOptional()
  readonly p: string;

  @IsOptional()
  readonly l: string;

  @IsOptional()
  readonly o: string;

  @IsOptional()
  readonly f: string;
}
