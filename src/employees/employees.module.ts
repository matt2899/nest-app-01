import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MyLoggerModule } from 'src/my_logger/my_logger.module';

@Module({
  imports: [DatabaseModule, MyLoggerModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule { }
