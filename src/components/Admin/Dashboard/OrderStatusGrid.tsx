'use client';

import { Paper, Grid, Typography, Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { OrderStatusUIData } from '@/types/dashboard';

interface OrderStatusGridProps {
    readonly data: OrderStatusUIData[];
}

export default function OrderStatusGrid({ data }: OrderStatusGridProps) {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG
            </Typography>

            <Grid container spacing={2}>
                {data.map((item) => (
                    <Grid size={{xs: 12, sm: 6}} key={item.label}>
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="space-between"
                            sx={{ 
                                p: 2, 
                                backgroundColor: 'background.default',
                                borderRadius: 1
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2}>
                                <Image
                                    src={item.img}
                                    alt={item.label}
                                    width={50}
                                    height={50}
                                    style={{ objectFit: 'contain' }}
                                />
                                <Typography>{item.label}</Typography>
                            </Box>

                            <Box 
                                display="flex" 
                                flexDirection="column" 
                                alignItems="flex-end"
                            >
                                <Typography variant="h6">
                                    {item.quantity}
                                </Typography>
                                <Link 
                                    href={item.to}
                                    style={{ 
                                        color: 'var(--primary-color)',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Xem chi tiết
                                </Link>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}
