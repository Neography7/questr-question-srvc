import { Injectable } from '@nestjs/common';
import * as i18next from 'i18next';

@Injectable()
export class I18nService {
  constructor() {
    i18next
      .init({
        resources: {
          en: { translation: require('./lang/en.json') },
          tr: { translation: require('./lang/tr.json') },
        }, 
        fallbackLng: 'en',
        preload: ['en', 'tr'],
        saveMissing: true,
      }); 
  } 
}  