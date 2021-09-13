import { IPaginationModel } from '../interfaces/pagination-model';

export class PaginationModel implements IPaginationModel {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRows: number;

    constructor() {
        this.pageNumber = 0;
        this.pageSize = 0;
        this.totalPages = 0;
        this.totalRows = 0;
    }

}
