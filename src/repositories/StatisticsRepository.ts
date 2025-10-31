import { AxiosInstance } from 'axios';
import { IStatisticsRepository } from './interfaces/IStatisticsRepository';
import { SalesReportParams, SalesReportResponse, StatisticsResponse } from '@/types/statistics';
import { handleAxiosError } from './errors/RepositoryError';

export class StatisticsRepository implements IStatisticsRepository {
    private readonly basePath = '/statistics';

    constructor(private readonly apiClient: AxiosInstance) {}

    async getStatistics(): Promise<StatisticsResponse> {
        try {
            const response = await this.apiClient.get<{ data: StatisticsResponse }>(
                `${this.basePath}/overview`
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getSalesReport(params: SalesReportParams): Promise<SalesReportResponse> {
        try {
            const response = await this.apiClient.get<{ data: SalesReportResponse }>(
                `${this.basePath}/sales-report`,
                { params }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }
}
