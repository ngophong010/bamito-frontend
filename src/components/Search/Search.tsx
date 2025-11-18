"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Autocomplete, TextField, Box, CircularProgress, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchSearchResults, clearSearchResults } from "@/lib/redux/features/search/searchSlice";
import { createSlug } from "@/lib/utils/slug";
import { ProductListItem } from "@/types";
import { getPopularSearches } from "@/services/searchService";
import "./Search.scss";

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { results, status } = useAppSelector((state) => state.search);
  const isLoading = status === 'loading';

  // Fetch popular searches on mount
  useEffect(() => {
    const fetchPopular = async () => {
      const terms = await getPopularSearches();
      setPopularSearches(terms);
    };
    fetchPopular();
  }, []);

  // Debounced search
  useEffect(() => {
    if (inputValue.trim()) {
      const handler = setTimeout(() => {
        dispatch(fetchSearchResults({ name: inputValue, limit: 5 }));
      }, 500);
      return () => clearTimeout(handler);
    } else {
      dispatch(clearSearchResults());
    }
  }, [inputValue, dispatch]);

  // Combine popular searches and results for options
  const options: (string | ProductListItem)[] = inputValue.trim() ? results : popularSearches;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={isLoading}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, value) => {
        if (value) {
          if (typeof value === 'string') {
            router.push(`/search?q=${encodeURIComponent(value)}`);
          } else {
            router.push(`/${createSlug(value.category.name)}/${createSlug(value.name)}-${value.productId}`);
          }
        }
      }}
      renderOption={(props, option) => {
        if (typeof option === 'string') {
          return (
            <Box component="li" {...props} key={option}>
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: '8px', color: '#666' }} />
              {option}
            </Box>
          );
        }
        return (
          <Box component="li" {...props} key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src={option.image || '/placeholder.png'} alt={option.name} width={40} height={40} />
            <Box>
              <div>{option.name}</div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>{currencyFormatter.format(option.price)}</div>
            </Box>
          </Box>
        );
      }}
      PaperComponent={(props) => (
        <Paper {...props}>
          {!inputValue.trim() && (
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>TÌM KIẾM PHỔ BIẾN</div>
            </Box>
          )}
          {props.children}
          {inputValue.trim() && results.length >= 5 && (
            <Box sx={{ p: 1, borderTop: '1px solid #eee', textAlign: 'center' }}>
              <Link href={`/search?q=${encodeURIComponent(inputValue)}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                Xem tất cả kết quả
              </Link>
            </Box>
          )}
          {inputValue.trim() && results.length === 0 && !isLoading && (
            <Box sx={{ p: 2, textAlign: 'center', color: '#666' }}>
              Không tìm thấy kết quả cho '{inputValue}'
            </Box>
          )}
        </Paper>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Tìm kiếm sản phẩm..."
          variant="outlined"
          size="small"
          onKeyDown={handleKeyDown}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#666' }} />
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default Search;
