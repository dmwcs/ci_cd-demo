import { useNavigate } from 'react-router';

export const useNavigateToPump = () => {
  const navigate = useNavigate();

  const handlePumpClick = (pumpId: string, isEditMode: boolean) => {
    return (e: React.MouseEvent) => {
      // Don't navigate if clicking on edit mode controls
      if (isEditMode) return;

      // Don't navigate if clicking on checkbox or edit button
      const target = e.target as HTMLElement;
      if (target.closest('input') || target.closest('button')) return;

      navigate(`/pump/${pumpId}`);
    };
  };

  return { handlePumpClick };
};
