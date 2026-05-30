import type { ItemWithCalc, PeriodConfig } from '../types';
import { MONTHS } from '../data/siiTables';

interface Props {
  items: ItemWithCalc[];
  period: PeriodConfig;
  totalOriginal: number;
  totalReajustado: number;
}

function clp(value: number) {
  return value.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  });
}

export default function ExportButton({ items, period, totalOriginal, totalReajustado }: Props) {
  const hasItems = items.some(i => i.resultado !== null);

  async function handlePDF() {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Encabezado
    doc.setFillColor(26, 92, 91);
    doc.rect(0, 0, 297, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Corrección Monetaria — Mujer Cobra', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Art. 41 LIR · Servicio de Impuestos Internos de Chile', 14, 19);
    doc.text(
      `Período: ${MONTHS[period.mesCierre - 1]} ${period.añoCierre}   ·   Generado: ${new Date().toLocaleDateString('es-CL')}`,
      14,
      24,
    );

    doc.setTextColor(28, 28, 26);

    const validItems = items.filter(i => i.resultado !== null);

    const tableBody = validItems.map(({ item, resultado }) => [
      item.nombre,
      `${item.cantidad} ${item.unidad}`,
      `${MONTHS[item.mesCompra - 1]} ${item.añoCompra}`,
      clp(item.valorUnitario),
      clp(resultado!.valorOriginalTotal),
      `F${resultado!.formula}`,
      resultado!.porcentaje !== null ? `${resultado!.porcentaje}%` : '—',
      clp(resultado!.valorReajustadoTotal),
      `${resultado!.diferencia >= 0 ? '+' : ''}${clp(resultado!.diferencia)}`,
    ]);

    autoTable(doc, {
      head: [
        ['Ítem', 'Cantidad', 'Fecha compra', 'V. Unitario', 'V. Original', 'Fórmula', '%', 'V. Reajustado', 'Diferencia'],
      ],
      body: tableBody,
      foot: [
        ['Total', '', '', '', clp(totalOriginal), '', '', clp(totalReajustado),
          `${totalReajustado - totalOriginal >= 0 ? '+' : ''}${clp(totalReajustado - totalOriginal)}`],
      ],
      startY: 32,
      styles: { fontSize: 8.5, cellPadding: 3 },
      headStyles: { fillColor: [26, 92, 91], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [245, 239, 230], textColor: [28, 28, 26], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 50 },
        4: { halign: 'right' },
        6: { halign: 'center' },
        7: { halign: 'right', fontStyle: 'bold' },
        8: { halign: 'right' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 8) {
          const text = String(data.cell.raw);
          if (text.startsWith('+')) data.cell.styles.textColor = [46, 107, 79];
          else if (text.startsWith('-')) data.cell.styles.textColor = [139, 38, 53];
        }
      },
    });

    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      const pageH = doc.internal.pageSize.getHeight();
      const pageW = doc.internal.pageSize.getWidth();
      doc.text(
        `Mujer Cobra — Corrección Monetaria ${period.añoCierre} · Taller de Ingeniería de Software, UTEM`,
        14,
        pageH - 8,
      );
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageW - 14,
        pageH - 8,
        { align: 'right' },
      );
    }

    doc.save(`correccion-monetaria-${period.añoCierre}-${String(period.mesCierre).padStart(2, '0')}.pdf`);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="export-actions">
      <button className="btn btn-secondary" onClick={handlePrint}>
        Imprimir
      </button>
      <button
        className="btn btn-primary"
        onClick={handlePDF}
        disabled={!hasItems}
        title={!hasItems ? 'Agrega ítems para exportar' : undefined}
      >
        Exportar PDF
      </button>
    </div>
  );
}
