import { Controller, Get, Query, ValidationPipe, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.dto';
import { AutocompleteQueryDto } from './dto/autocomplete.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  async search(
    @Query(new ValidationPipe({ transform: true })) query: SearchQueryDto,
    @Req() req: any
  ) {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
      // Public users and brand partners only see published content in global search
      query.partnerStatus = 'PUBLISHED';
      query.offerStatus = 'PUBLISHED';
    }
    return this.searchService.search(query);
  }

  @Public()
  @Get('autocomplete')
  async autocomplete(
    @Query(new ValidationPipe({ transform: true })) query: AutocompleteQueryDto,
    @Req() req: any
  ) {
    const user = req.user;
    // Autocomplete also restricted
    // Note: service already forces PUBLISHED for autocomplete
    return this.searchService.autocomplete(query);
  }
}
