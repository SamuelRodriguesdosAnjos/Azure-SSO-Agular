import { IGatewayConfig } from './gateway-config';

export interface ITokenConfig {

    headers?: any;
    body?: string;
    gatewayConfig: IGatewayConfig;

}
