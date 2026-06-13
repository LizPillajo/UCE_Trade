import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteVenture, updateVenture, updateVentureStatus } from '../services/api';

export const useVentureMutations = () => {
  const queryClient = useQueryClient();

  // 1. Borrar Venture
  const deleteMutation = useMutation({
    mutationFn: deleteVenture,
    onSuccess: () => {
      toast.success("Venture deleted successfully");
      // Invalidamos ambas listas (Admin y Estudiante) para que se refresquen solas
      queryClient.invalidateQueries(['myVentures']);
      queryClient.invalidateQueries(['adminVentures']);
      queryClient.invalidateQueries(['studentStats']);
    },
    onError: () => toast.error("Failed to delete venture")
  });

  // 2. Editar Venture (Estudiante)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateVenture(id, data),
    onSuccess: () => {
      toast.success("Venture updated successfully");
      queryClient.invalidateQueries(['myVentures']);
    },
    onError: () => toast.error("Failed to update venture")
  });

  // 3. Cambiar Estado (Admin)
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVentureStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated!");
      queryClient.invalidateQueries(['adminVentures']);
    },
    onError: () => toast.error("Failed to update status")
  });

  return {
    deleteVenture: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    
    updateVenture: updateMutation.mutate,
    isUpdating: updateMutation.isPending,

    changeStatus: statusMutation.mutate,
    isChangingStatus: statusMutation.isPending
  };
};