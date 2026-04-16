/**
 * certificate.js
 * Genera y descarga un certificado bancario en formato PDF usando la librería jsPDF.
 * El certificado incluye información del titular, datos de la cuenta y fecha de expedición.
 * Se activa al hacer clic en el botón de navegación de certificados.
 */

import * as alertas from "../ui/alerts.js";

// Botón que dispara la generación del certificado
const btnDescargar = document.querySelector("#navCertificados");

/**
 * Genera un certificado bancario en PDF con los datos del usuario y lo descarga.
 * Utiliza jsPDF (cargado globalmente desde CDN) para construir el documento.
 *
 * @param {Object} usuario - Objeto del usuario activo con datos personales y de cuenta.
 */
function generarCertificado(usuario) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const marginX = 25;     // Margen horizontal del documento
    let currentY = 30;      // Posición vertical actual (se va incrementando)

    // --- 1. Título institucional centrado ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CERTIFICACIÓN BANCARIA", 105, currentY, { align: "center" });

    // --- 2. Encabezado de la entidad emisora ---
    currentY += 25;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("EL DEPARTAMENTO DE SERVICIOS AL CLIENTE", marginX, currentY);

    currentY += 10;
    doc.text("CERTIFICA:", marginX, currentY);

    // --- 3. Cuerpo del certificado con datos del titular ---
    currentY += 15;
    doc.setFont("helvetica", "normal");

    const fechaApertura = new Date(usuario.cuenta.fecha).toLocaleDateString();
    const hoy = new Date();
    const opcionesFecha = { day: "numeric", month: "long", year: "numeric" };
    const fechaActualStr = hoy.toLocaleDateString("es-ES", opcionesFecha);

    // Texto formal con nombre completo, tipo y número de documento del titular
    const cuerpoTexto =
        `Que se hace presente, para los fines que el interesado estime convenientes, ` +
        `que el(la) Sr(a). ${usuario.nombres.toUpperCase()} ${usuario.apellidos.toUpperCase()}, ` +
        `identificado(a) con ${usuario.tipoDoc} No. ${usuario.numeroDoc}, mantiene en nuestra ` +
        `institución una cuenta activa bajo los siguientes parámetros:`;

    // splitTextToSize divide el texto para que respete los márgenes del PDF
    const textLines = doc.splitTextToSize(cuerpoTexto, 160);
    doc.text(textLines, marginX, currentY);

    // --- 4. Cuadro informativo con detalles de la cuenta ---
    currentY += (textLines.length * 7) + 5;
    doc.setFont("helvetica", "bold");
    doc.text(`• Tipo de Producto:  Cuenta de Ahorros`, marginX + 5, currentY);
    doc.text(`• Número de Cuenta:  ${usuario.cuenta.numCuenta}`, marginX + 5, currentY + 7);
    doc.text(`• Fecha de Apertura: ${fechaApertura}`, marginX + 5, currentY + 14);
    doc.text(`• Saldo Disponible:  $${Number(usuario.cuenta.dinero).toLocaleString("es-CO")}`, marginX + 5, currentY + 21);

    // --- 5. Cláusula de vigencia y cierre del documento ---
    currentY += 45;
    doc.setFont("helvetica", "normal");
    const cierre =
        `La presente información se suministra con base en los registros internos de la entidad ` +
        `a la fecha y hora de expedición. Se extiende la presente certificación en la ciudad de ` +
        `Bogotá D.C., a los ${fechaActualStr}.`;

    const cierreLines = doc.splitTextToSize(cierre, 160);
    doc.text(cierreLines, marginX, currentY);

    // --- 6. Firma digital / sello al pie del documento ---
    currentY += 40;
    doc.setLineWidth(0.5);
    doc.line(70, currentY, 140, currentY); // Línea para firma
    doc.setFontSize(9);
    doc.text("DEPARTAMENTO DE OPERACIONES", 105, currentY + 5, { align: "center" });
    doc.text("Documento generado electrónicamente", 105, currentY + 10, { align: "center" });

    // Descargar el archivo con nombre basado en el número de documento
    doc.save(`Certificado_${usuario.numeroDoc}.pdf`);
}

// Evento del botón: valida sesión activa y genera el certificado
btnDescargar.addEventListener("click", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    // Si no hay sesión activa, mostrar error y detener el proceso
    if (!usuario) {
        alertas.mostrarErrorGeneral("No hay usuario activo");
        return;
    }

    generarCertificado(usuario);
});