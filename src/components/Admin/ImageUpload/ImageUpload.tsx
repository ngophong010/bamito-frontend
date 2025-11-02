import { ChangeEvent } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Button,
    Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Image from 'next/image';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
    readonly images: string[];
    readonly onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    readonly onRemoveImage: (index: number) => void;
}

export default function ImageUpload({
    images,
    onImageChange,
    onRemoveImage,
}: ImageUploadProps) {
    return (
        <Box className={styles.imageUpload}>
            <Box className={styles.uploadButton}>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography>Add Images</Typography>
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={onImageChange}
                        />
                    </Box>
                </Button>
                <Typography variant="caption" color="textSecondary">
                    Upload product images (PNG, JPG)
                </Typography>
            </Box>

            {images.map((image) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={image}>
                    <Box className={styles.imagePreview}>
                        <Image
                            src={image}
                            alt={`Product image`}
                            width={150}
                            height={150}
                            style={{ objectFit: 'cover' }}
                        />
                        <IconButton
                            className={styles.deleteButton}
                            onClick={() => onRemoveImage(images.indexOf(image))}
                            size="small"
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Grid>
            ))}

        </Box>
    );
}
