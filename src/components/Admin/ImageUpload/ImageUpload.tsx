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
    images: string[];
    onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
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
                    Add Images
                    <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={onImageChange}
                    />
                </Button>
                <Typography variant="caption" color="textSecondary">
                    Upload product images (PNG, JPG)
                </Typography>
            </Box>

            <Grid container spacing={2} className={styles.previewGrid}>
                {images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box className={styles.imagePreview}>
                            <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                width={150}
                                height={150}
                                objectFit="cover"
                            />
                            <IconButton
                                className={styles.deleteButton}
                                onClick={() => onRemoveImage(index)}
                                size="small"
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}