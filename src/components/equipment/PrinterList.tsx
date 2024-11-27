import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Button,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import PrinterMonitor from './PrinterMonitor';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrinters } from '../../hooks/usePrinters';

const ITEMS_PER_PAGE = 6;

const PrinterList: React.FC = () => {
  const { printers, loading, error, refreshAllPrinters } = usePrinters();
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [page, setPage] = useState(1);

  const departments = useMemo(() => {
    const deptSet = new Set(printers.map((printer) => printer.department));
    return Array.from(deptSet);
  }, [printers]);

  const filteredPrinters = useMemo(() => {
    return printers.filter((printer) => {
      const matchesSearch = printer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        printer.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = department === 'all' || printer.department === department;
      return matchesSearch && matchesDepartment;
    });
  }, [printers, searchTerm, department]);

  const paginatedPrinters = useMemo(() => {
    return filteredPrinters.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }, [filteredPrinters, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDepartment(event.target.value as string);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando impressoras...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h1">
              Monitoramento de Impressoras
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={refreshAllPrinters}
              variant="outlined"
            >
              Atualizar Todas
            </Button>
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar impressoras..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Departamento</InputLabel>
            <Select
              value={department}
              onChange={handleDepartmentChange}
              label="Departamento"
            >
              <MenuItem value="all">Todos</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Grid container spacing={3}>
                {paginatedPrinters.map((printer) => (
                  <Grid item xs={12} md={6} key={printer.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PrinterMonitor
                        printerId={printer.id}
                        onError={(error) => console.error(`Erro na impressora ${printer.name}:`, error)}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </AnimatePresence>
        </Grid>

        {filteredPrinters.length > ITEMS_PER_PAGE && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(filteredPrinters.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          </Grid>
        )}

        {filteredPrinters.length === 0 && (
          <Grid item xs={12}>
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Nenhuma impressora encontrada
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export { PrinterList };
export default PrinterList;
