import { Injectable } from '@angular/core';
import { ServiceBase } from '../common/service.base';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import _ from "lodash";
import { UserService } from '../login/user.service';
import { Document } from './document';

@Injectable({
    providedIn: 'root'
})
export class DocumentService extends ServiceBase {

    private documentsServiceUrl: string;
    private uploadUrl: string;

    constructor(private http: Http, userService: UserService) {
        super('DocumentsService', userService);
        this.documentsServiceUrl = `${environment.apiUrl}/documents`;
        this.uploadUrl = `${environment.apiUrl}/upload/document`;
    }

    getDocuments(): Promise<Document[]> {
        const headers = this.createAuthorizationHeader();
        return this.http
            .get(this.documentsServiceUrl, { headers: headers }).toPromise()
            .then((response) => {
                let documents = response.json();
                documents = documents.map((document) => new Document(document));
                return _.orderBy(documents, ['date'], ['desc'])
            });
    };

    createOrUpdateDocument(document: Document): Promise<Document> {
        const headers = this.createAuthorizationHeader();
        var query = (document.isNew()) ?
            this.http.put(this.documentsServiceUrl, document, { headers: headers }).toPromise() :
            this.http.patch(`${this.documentsServiceUrl}/${document._id}`, document, { headers: headers }).toPromise();

        return query
            .then((document) => {
                return new Document(document.json());
            })
    }

    deleteDocument(id: string): Promise<Document> {
        const headers = this.createAuthorizationHeader();
        return this.http
            .delete(`${this.documentsServiceUrl}/${id}`, { headers: headers }).toPromise()
            .then((document) => {
                return new Document(document.json());
            });
    }

}