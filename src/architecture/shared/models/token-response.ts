import { ITokenResponse } from '../interfaces/token-response';

export class TokenResponse implements ITokenResponse {

    public access_token: string;
    public refresh_token: string;
    public token_type: string;
    public expires_in: number;

    constructor() {

        this.access_token = '';
        this.refresh_token = '';
        this.token_type = '';
        this.expires_in = 0;

    }

}
