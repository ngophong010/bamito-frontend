'use client';

import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { StatisticCardData } from '@/types/dashboard';

interface StatisticCardProps {
    data: StatisticCardData;
    isLoading?: boolean;
}

export default function StatisticCard({ data, isLoading = false }: StatisticCardProps) {
    if (isLoading) {
        return (
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: 'background.paper'
                }}
            >
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rectangular" height={60} />
                {data.change !== undefined && (
                    <Skeleton variant="text" width="40%" />
                )}
            </Paper>
        );
    }

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3,
                height: '100%',
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}
        >
            <Box display="flex" alignItems="center" gap={2}>
                <img src={data.icon} alt="" width={40} height={40} />
                <Typography variant="subtitle2" color="text.secondary">
                    {data.title}
                </Typography>
            </Box>

            <Typography variant="h4" sx={{ my: 2, fontWeight: 600 }}>
                {data.value}
            </Typography>

            {data.change !== undefined && (
                <Typography 
                    variant="body2"
                    color={data.change >= 0 ? 'success.main' : 'error.main'}
                >
                    {data.change >= 0 ? '+' : ''}{data.change}% so với tháng trước
                </Typography>
            )}
        </Paper>
    );
}