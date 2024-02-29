import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('apiv2/mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Get('alerta-comercial')
  async alertaComercialMail() {
    const descripcion = `<p>A partir de una escasez de la leche en polvo en&nbsp;Cuba, algunos pa&iacute;ses han aumentado sus env&iacute;os comerciales hacia ese destino. &nbsp;</p>\r\n\r\n<p>Considerando esta situaci&oacute;n, ProDominicana, a partir de los datos de Trade Map, identific&oacute; un aumento de un 62% en las importaciones de leche en polvo por parte de Cuba, alcanzando un total de US$ 27.7 millones para el 2022.&nbsp;</p>\r\n\r\n<p>Entre sus diferentes proveedores, se identific&oacute; un mayor crecimiento en los env&iacute;os comerciales de este producto&nbsp;desde B&eacute;lgica, Pa&iacute;ses Bajos y Uruguay:&nbsp;</p>\r\n\r\n<ul>\r\n<li>\r\n<p>Desde B&eacute;lgica, las exportaciones de leche en polvo hacia Cuba totalizaron US$ 13.6 millones, logrando&nbsp;un crecimiento interanual de un 76% al 2022.&nbsp;</p>\r\n</li>\r\n<li>\r\n<p>En el caso de Pa&iacute;ses Bajos, estas exportaciones hacia Cuba alcanzaron un monto de US$ 7.7 millones, con un crecimiento interanual de un 293%.&nbsp;</p>\r\n</li>\r\n<li>\r\n<p>Desde Uruguay, las exportaciones de leche en polvo hacia Cuba totalizaron US$ 2.8 millones, representando un crecimiento interanual de un 72% respecto al a&ntilde;o anterior.&nbsp;</p>\r\n</li>\r\n</ul>\r\n\r\n<p>Aunque la Rep&uacute;blica Dominicana no exporta grandes cantidades de este producto, esta podr&iacute;a ser una oportunidad para promover la industrializaci&oacute;n de la leche producida en el pa&iacute;s, con miras a exportarla y abastecer al mercado cubano.&nbsp;</p>\r\n`;
    return this.mailService.newAlertaComercialMail(
      'Cuba aumenta sus importaciones de leche en polvo',
      'Obstaculo',
      descripcion,
      'https://sinim.prodominicana.gob.do/apiv2/data/alertacomercial/1/img/1696880024322.jpeg',
      'eliamps07@outlook.com',
    );
  }
}
