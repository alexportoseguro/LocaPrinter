import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { printerIntegrationService } from '../../services/printerIntegrationService';

interface PrintJobSubmitProps {
  printerId: string;
  onJobSubmitted?: () => void;
}

const PrintJobSubmit: React.FC<PrintJobSubmitProps> = ({ printerId, onJobSubmitted }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copies, setCopies] = useState(1);
  const [duplex, setDuplex] = useState(false);
  const [paperSize, setPaperSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [quality, setQuality] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Por favor, selecione um arquivo para imprimir');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await printerIntegrationService.submitPrintJob(printerId, selectedFile);

      // Limpar o formulário
      setSelectedFile(null);
      setCopies(1);
      setDuplex(false);
      setPaperSize('A4');
      setOrientation('portrait');
      setQuality('normal');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onJobSubmitted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar trabalho de impressão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Novo Trabalho de Impressão
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                >
                  {selectedFile ? selectedFile.name : 'Selecionar Arquivo'}
                </Button>
                {selectedFile && (
                  <Typography variant="caption" color="textSecondary">
                    Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                )}
              </Box>

              <TextField
                type="number"
                label="Número de Cópias"
                value={copies}
                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 99 }}
              />

              <FormControl fullWidth>
                <InputLabel>Tamanho do Papel</InputLabel>
                <Select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                  label="Tamanho do Papel"
                >
                  <MenuItem value="A4">A4</MenuItem>
                  <MenuItem value="A3">A3</MenuItem>
                  <MenuItem value="Letter">Carta</MenuItem>
                  <MenuItem value="Legal">Ofício</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Orientação</InputLabel>
                <Select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  label="Orientação"
                >
                  <MenuItem value="portrait">Retrato</MenuItem>
                  <MenuItem value="landscape">Paisagem</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Qualidade</InputLabel>
                <Select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  label="Qualidade"
                >
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">Alta Qualidade</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={duplex}
                    onChange={(e) => setDuplex(e.target.checked)}
                  />
                }
                label="Impressão Frente e Verso"
              />

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} /> : <PrintIcon />}
                disabled={loading || !selectedFile}
                fullWidth
              >
                {loading ? 'Enviando...' : 'Imprimir'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrintJobSubmit;
