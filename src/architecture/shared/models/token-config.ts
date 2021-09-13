import { ITokenConfig } from '../interfaces/token-config';
import { GatewayConfig } from './gateway-config';
import { HttpHeaders } from '@angular/common/http';

export class TokenConfig implements ITokenConfig {

    public headers?: HttpHeaders;
    public body?: string;
    public gatewayConfig: GatewayConfig;

}
