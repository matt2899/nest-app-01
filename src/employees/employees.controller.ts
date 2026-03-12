import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Ip } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Prisma } from 'src/generated/prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my_logger/my_logger.service';


@SkipThrottle()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService, private readonly logger: MyLoggerService) { }

  @Post()
  create(@Body() createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.employeesService.create(createEmployeeDto);
  }

  @SkipThrottle({ default: false })
  @Get()
  findAll(@Ip() ip: string, @Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    this.logger.log(`findAll called with ip: ${ip}`, EmployeesController.name);
    return this.employeesService.findAll(role);
  }

  @Throttle({ short: { ttl: 10000, limit: 1 } })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
