import { HttpClient, HttpParams } from '@angular/common/http';
import {PaginatedResult} from '../_models/pagination';
import { map } from 'rxjs';

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }
  
  export function getPagintionResult<T>(url: string,params: HttpParams,http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  
      return http.get<T>(url, { observe: 'response', params }).pipe(
        map(response => {
          paginatedResult.result = response.body as any;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') as any);
          }
          return paginatedResult;
        })
      );
    }