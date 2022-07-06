import { Controller, Get, UseGuards, Req, Post, HttpCode } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaidGuard } from 'src/auth/paid.guard';
import { RequestWithUser } from 'src/auth/RequestWithUser';
import { DrillsGenerator } from './drills.generator';

@Controller('drills')
export class DrillsController {
  constructor(private moduleRef: ModuleRef) {}

  @UseGuards(JwtAuthGuard, PaidGuard)
  @Post('report-progress')
  @HttpCode(200)
  async postReportProgress() {
    return {
      success: true,
      finishContent: {
        title: 'Good job!',
        text:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut imperdiet tortor. Quisque molestie turpis vitae ante iaculis, a convallis ante porta. Nullam a viverra elit, non interdum sem. Pellentesque quis felis ullamcorper dolor sollicitudin lacinia. Aliquam ac lacinia diam, at viverra urna. Duis eleifend, nunc quis pharetra laoreet, enim ipsum faucibus dui, euismod efficitur metus ipsum in massa. Curabitur dictum, ante non lobortis iaculis, leo mauris cursus nisi, non condimentum nunc ligula in sapien.',
      },
    };
  }

  @UseGuards(JwtAuthGuard, PaidGuard)
  @Get('list')
  async getList(@Req() req: RequestWithUser) {
    const user = req.user;

    let generator = await this.moduleRef.create(DrillsGenerator);
    return await generator.getList(user);
  }
}
