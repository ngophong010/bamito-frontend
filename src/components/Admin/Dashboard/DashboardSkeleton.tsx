'use client';
import { Box, Paper, Skeleton } from '@mui/material';

type DashboardSkeletonProps = Readonly<{
    type: 'chart' | 'grid';
}>;

export default function DashboardSkeleton({ type }: DashboardSkeletonProps) {
    if (type === 'chart') {
        return (
            <Paper sx={{ p: 3, height: 400 }}>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
            </Paper>
        );
    }

    const skeletonItems = ['s1', 's2', 's3', 's4']; // stable keys

    return (
        <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width={300} height={32} sx={{ mb: 3 }} />
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                {skeletonItems.map((id) => (
                    <Box key={id} display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="circular" width={50} height={50} />
                        <Box flex={1}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="40%" />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}
