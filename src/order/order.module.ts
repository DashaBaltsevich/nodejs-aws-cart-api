import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './services';
import { OrderController } from './order.controller';
import { DBModule } from '../database/database.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [forwardRef(() => DBModule), forwardRef(() => CartModule)],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
