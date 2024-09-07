import {
  Controller,
  Get,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryUseCase } from 'src/use-cases/inventory/inventory.use-case';

@ApiTags('Inventory')
@Controller('/inventory')
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(private inventoryUseCases: InventoryUseCase) { }

  @Get()
  async getAllProductInventories() {
    this.logger.log(`getAllProductInventories() - Start`);
    return this.inventoryUseCases.getAllProductInventories();
  }
}
