import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role-checker.guard';
import { GlobalErrorCatcher } from 'src/middleware/error.middleware';
import { MessageResponse, ROLE } from 'src/types/generalTypes';
import { ERROR_MSG, SUCCESS_MSG } from 'src/utils/responses';
import { CatalogService } from './catalog.service';
import { CreateBookDto } from './dto/createBook.dto';

@UseFilters(GlobalErrorCatcher)
@Controller('catalog')
@ApiTags('Catalog Routes')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({ summary: 'Додати нову кнгиу' })
  @ApiBearerAuth('Token')
  @ApiUnauthorizedResponse({
    description: ERROR_MSG.userAccess,
  })
  @ApiCreatedResponse({
    description: SUCCESS_MSG.createBookSuccess,
    type: MessageResponse,
  })
  @ApiInternalServerErrorResponse({ description: ERROR_MSG.server })
  @Post('createBook')
  @UseGuards(JwtAuthGuard, RoleGuard(ROLE.user))
  createBook(@Body() createBookDto: CreateBookDto): Promise<MessageResponse> {
    return this.catalogService.createBook(createBookDto);
  }
}
