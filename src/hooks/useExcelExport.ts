import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import type { SchedulingData } from '../types';
import { LOCATION_LABELS, EXPORT_FILENAME_PREFIX, ERROR_MESSAGES } from '../constants';

export const useExcelExport = () => {
  const exportToExcel = useCallback(async (schedulings: SchedulingData[]) => {
    if (schedulings.length === 0) {
      alert(ERROR_MESSAGES.NO_SCHEDULINGS);
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Agendamentos');

    // Definir cabeçalhos
    worksheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Dia da Semana', key: 'dayOfWeek', width: 15 },
      { header: 'Local', key: 'location', width: 15 },
    ];

    // Adicionar dados
    schedulings.forEach(scheduling => {
      worksheet.addRow({
        email: scheduling.email,
        date: scheduling.date.toLocaleDateString('pt-BR'),
        dayOfWeek: scheduling.dayOfWeek,
        location: LOCATION_LABELS[scheduling.location as keyof typeof LOCATION_LABELS] || scheduling.location,
      });
    });

    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Gerar e baixar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${EXPORT_FILENAME_PREFIX}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  }, []);

  return { exportToExcel };
};