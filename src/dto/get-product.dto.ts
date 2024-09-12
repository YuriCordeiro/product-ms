import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetProductDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly sku: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly value: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly availableInStock: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
