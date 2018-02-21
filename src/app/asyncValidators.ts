import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, delay, map, tap } from 'rxjs/operators';

interface IValidationResult {
  [key: string]: any;
}

export function simpleAsyncValidator(): Observable<IValidationResult> {
  // return of({ simpleAsyncValidator: 'blew up' });
  // OK
  return of(undefined);
}

export function slowAsyncValidator(): Observable<IValidationResult> {
  return of(undefined).pipe(delay(1000));
}

const url = 'https://api.zippopotam.us/us/';

export function westernZipValidatorFactory(http: HttpClient) {
  return (control: FormControl): Observable<IValidationResult> => {
    return http.get<any>(url + control.value).pipe(
      tap(r => console.log(r)),
      map(data => data.places[0].longitude),
      map(l => l < -90),
      tap(ok => ok ? console.log('It is west enough') : console.log('It is not west enough')),
      map(ok => ok ? undefined : { westerliness: 'not enough' }),
      catchError(e => {
        return of({ westerliness: 'Unable to verify' });
      }));
  };
}
