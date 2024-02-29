import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('apiv2/')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get('countries')
  async getCountry() {
    return this.countryService.getCountries();
  }

  @Get('country/:id')
  async getCountryById(@Param() id: number) {
    return this.countryService.getCountryById(id);
  }

  @Get('countries/select')
  async getCountriesLabelValue() {
    return this.countryService.getCountriesLabelValue();
  }
}
