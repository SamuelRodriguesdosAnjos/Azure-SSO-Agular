import { IGatewayConfig } from '../interfaces/gateway-config';

export class GatewayConfig implements IGatewayConfig {

    public urlHost: string;
    public clientSecret: string;
    public clientId: string;

}
