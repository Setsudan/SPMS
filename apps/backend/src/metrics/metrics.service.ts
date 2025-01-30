import { Injectable, OnModuleInit } from '@nestjs/common';
import * as promClient from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
    onModuleInit() {
        promClient.collectDefaultMetrics();
    }

    async getMetrics(): Promise<string> {
        return promClient.register.metrics();
    }
}
