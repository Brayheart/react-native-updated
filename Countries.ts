// @flow
import { get } from 'lodash'
import { sort } from 'ramda'
import I18n from '../../language/i18n'
import countries from 'world-countries'
import metadata from 'libphonenumber-js/metadata.min.json'
import { collatorSort } from './String'

const mappings = {
  de: 'deu',
  fi: 'fin',
  fr: 'fra',
  hr: 'hrv',
  it: 'ita',
  jp: 'jpn',
  nl: 'nld',
  pt: 'por',
  ru: 'rus',
  es: 'spa',
  sv: 'svk',
  zh: 'zho'
}

/**
 * Return a list of countries with name translated eventually into a language
 * that we support
 *
 * @returns {name: string, key: string, cca2: string, callCode: number}[]
 */
export function getCountries (): {name: string, key: string, cca2: string, callCode: number}[] {
  let locale = mappings[I18n.currentLocale()] ? mappings[I18n.currentLocale()] : false

  let all = sort(collatorSort, countries.map(country => {
    let name = country.name.common
    if (locale) {
      name = get(country, `translations.${locale}.common`, name)
    }

    let callCode = get(metadata, `countries.${country.cca2}[0]`)
    if (!callCode) {
      return false
    }
    return {
      name: name,
      key: country.cca2,
      cca2: country.cca2,
      callCode: callCode
    }
  }).filter(Boolean))

  return all
}