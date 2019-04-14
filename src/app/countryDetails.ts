class CurrencyDetails {
    code: string;
    name: string;
    symbol: string;
}

export class CountryDetails {
    name: string;
    alpha2Code: string;
    callingCodes: string[];
    currencies: CurrencyDetails[];
    flag: string;
    timezones: string[];
}

