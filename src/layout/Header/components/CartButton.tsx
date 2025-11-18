import React, { useState } from 'react';
import Link from 'next/link';
import { Popover, Box } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TippyCart from '@/components/TippyCart/TippyCart';

interface CartButtonProps {
    totalCount: number;
}


