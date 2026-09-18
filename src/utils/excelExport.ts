import { MonthlyPlan, PlatformAccount, RevenueTransaction } from "../types";

export function exportPlanToCSV(plan: MonthlyPlan): void {
  // Build UTF-8 BOM so Excel opens Spanish accents without garbled characters
  let csvContent = "\uFEFF";
  
  // Headers for Plan
  csvContent += "PLANIFICACIÓN MENSUAL DE MONETIZACIÓN - 1 PROMPT MASTER\n";
  csvContent += `Plan: "${plan.planName}"\n`;
  csvContent += `Meta Mensual: "${plan.monthlyTarget}"\n`;
  csvContent += `Ritmo Diario Objetivo: "${plan.dailyPacingTarget}"\n`;
  csvContent += `Estrategia: "${plan.strategyOverview}"\n\n`;

  // Table Columns
  csvContent += "Día,Plataforma,Tipo de Acción,Título de la Campaña,Prompt a Ejecutar con IA,Meta de Ingresos ($),Estado,Ingreso Real ($)\n";

  plan.days.forEach((d) => {
    const safePrompt = d.promptToExecute.replace(/"/g, '""');
    const safeTitle = d.title.replace(/"/g, '""');
    const actual = d.actualRevenue ? `$${d.actualRevenue.toFixed(2)}` : "$0.00";
    csvContent += `${d.day},"${d.platform}","${d.actionType}","${safeTitle}","${safePrompt}","${d.monetizationGoal}","${d.status}","${actual}"\n`;
  });

  // Download Trigger
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Plan_Monetizacion_30_Dias_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTransactionsToCSV(transactions: RevenueTransaction[]): void {
  let csvContent = "\uFEFF";
  csvContent += "REGISTRO DE TRANSACCIONES E INGRESOS EN TIEMPO REAL\n\n";
  csvContent += "ID Transacción,Fecha / Tiempo,Plataforma,Tipo de Ingreso,Descripción,Monto ($ USD),Estado\n";

  transactions.forEach((tx) => {
    const desc = tx.description.replace(/"/g, '""');
    csvContent += `"${tx.id}","${tx.timestamp}","${tx.platformName}","${tx.type}","${desc}","${tx.amount.toFixed(2)}","${tx.status}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Reporte_Ingresos_Monetizacion_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
