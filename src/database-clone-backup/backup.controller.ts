import { BackupService } from './backup.service';

import { Controller, Get } from '@nestjs/common';

@Controller('clone')
export class BackupController {
  constructor(private readonly backupController: BackupService) {}

  @Get('manual-backup')
  async manualBackup() {
    await this.backupController.handleCron();
    return 'Резервное копирование выполнено вручную.';
  }
}
