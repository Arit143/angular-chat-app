import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CountryDetails } from './countryDetails';

@Injectable()
export class ProfileService {

	constructor(private http: Http) { }

	/**
	 * Get request to get all the country details
	 */
	public getCountryDetails(): Observable<CountryDetails[]> {
	return this.http
		.get('https://restcountries.eu/rest/v2/all')
		.pipe(
		map((response: any) => {
			const results: any = [];
			const data = JSON.parse(response._body);
			data.map((item: CountryDetails) => {
			results.push({ 
				name: item.name, 
				alpha2Code: item.alpha2Code,
				callingCodes: item.callingCodes,
				currencies: item.currencies,
				flag: item.flag,
				timezones: item.timezones
				})
			});
			return results;
		}),
		catchError(this.handleError)
		)
	}

	/**
	 * 
	 * @param error 
	 * Handle error when get request fails
	 */
	private handleError (error: Response) {
		console.error('ApiService::handleError', error);
		return Observable.throw(error);
	}
}