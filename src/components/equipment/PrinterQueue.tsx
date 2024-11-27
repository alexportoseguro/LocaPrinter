import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  History as HistoryIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PrintJob } from '../../types/printer';
import { printerIntegrationService } from '../../services/printerIntegrationService';

interface PrinterQueueProps {
  printerId: string;
}

const PrinterQueue: React.FC<PrinterQueueProps> = ({ printerId }) => {
  const [queue, setQueue] = useState<PrintJob[]>([]);
  const [history, setHistory] = useState<PrintJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queueData = await printerIntegrationService.getPrintQueue(printerId);
      setQueue(queueData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fila de impressão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Atualiza a cada 10 segundos
    return () => clearInterval(interval);
  }, [printerId]);

  const handleCancelJob = async (job: PrintJob) => {
    try {
      await printerIntegrationService.cancelPrintJob(printerId, job.id);
      setQueue(current => current.filter(j => j.id !== job.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar trabalho');
    }
  };

  const getStatusColor = (status: PrintJob['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'printing':
        return 'primary';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderJobItem = (job: PrintJob, isHistory: boolean = false) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <ListItem>
        <ListItemText
          primary={job.name}
          secondary={
            <>
              <Typography variant="body2" color="textSecondary">
                {new Date(job.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Páginas: {job.pages}
              </Typography>
            </>
          }
        />
        <ListItemSecondaryAction>
          <Box display="flex" alignItems="center">
            <Chip
              size="small"
              label={job.status}
              color={getStatusColor(job.status)}
              sx={{ mr: 1 }}
            />
            {!isHistory && job.status === 'pending' && (
              <IconButton
                edge="end"
                aria-label="cancel"
                onClick={() => handleCancelJob(job)}
                size="small"
              >
                <CancelIcon />
              </IconButton>
            )}
          </Box>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </motion.div>
  );

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Fila de Impressão
          </Typography>
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(true)}
            size="small"
          >
            Histórico
          </Button>
        </Box>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        <AnimatePresence>
          {loading ? (
            <Typography color="textSecondary">Carregando...</Typography>
          ) : queue.length > 0 ? (
            <List>
              {queue.map((job) => renderJobItem(job))}
            </List>
          ) : (
            <Typography color="textSecondary" align="center">
              Nenhum trabalho na fila
            </Typography>
          )}
        </AnimatePresence>

        <Dialog
          open={showHistory}
          onClose={() => setShowHistory(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Histórico de Impressão</DialogTitle>
          <DialogContent>
            <List>
              {history.map((job) => renderJobItem(job, true))}
            </List>
            {history.length === 0 && (
              <Typography color="textSecondary" align="center">
                Nenhum histórico disponível
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowHistory(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export { PrinterQueue };
export default PrinterQueue;
