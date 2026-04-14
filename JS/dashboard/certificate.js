import * as alertas from "../ui/alerts.js";

const btnDescargar = document.querySelector("#navCertificados");

function generarCertificado(usuario) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // --- Configuración de Estilo ---
    const marginX = 25;
    let currentY = 30;

    // 1. Título Institucional
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CERTIFICACIÓN BANCARIA", 105, currentY, { align: "center" });

    // 2. Encabezado de Autoridad
    currentY += 25;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("EL DEPARTAMENTO DE SERVICIOS AL CLIENTE", marginX, currentY);
    
    currentY += 10;
    doc.text("CERTIFICA:", marginX, currentY);

    // 3. Cuerpo del mensaje (Redacción Bancaria)
    currentY += 15;
    doc.setFont("helvetica", "normal");
    
    const fechaApertura = new Date(usuario.cuenta.fecha).toLocaleDateString();
    const hoy = new Date();
    const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaActualStr = hoy.toLocaleDateString('es-ES', opcionesFecha);

    // Texto con terminología legal/bancaria
    const cuerpoTexto = `Que se hace presente, para los fines que el interesado estime convenientes, que el(la) Sr(a). ${usuario.nombres.toUpperCase()} ${usuario.apellidos.toUpperCase()}, identificado(a) con ${usuario.tipoDoc} No. ${usuario.numeroDoc}, mantiene en nuestra institución una cuenta activa bajo los siguientes parámetros:`;

    // Usamos splitTextToSize para que el texto respete los márgenes
    const textLines = doc.splitTextToSize(cuerpoTexto, 160);
    doc.text(textLines, marginX, currentY);

    // 4. Detalle de la Cuenta (Cuadro informativo)
    currentY += (textLines.length * 7) + 5;
    doc.setFont("helvetica", "bold");
    doc.text(`• Tipo de Producto:  Cuenta de Ahorros`, marginX + 5, currentY);
    doc.text(`• Número de Cuenta:  ${usuario.cuenta.numCuenta}`, marginX + 5, currentY + 7);
    doc.text(`• Fecha de Apertura: ${fechaApertura}`, marginX + 5, currentY + 14);
    doc.text(`• Saldo Disponible:  $${Number(usuario.cuenta.dinero).toLocaleString('es-CO')}`, marginX + 5, currentY + 21);

    // 5. Cláusula de Vigencia y Cierre
    currentY += 45;
    doc.setFont("helvetica", "normal");
    const cierre = `La presente información se suministra con base en los registros internos de la entidad a la fecha y hora de expedición. Se extiende la presente certificación en la ciudad de Bogotá D.C., a los ${fechaActualStr}.`;
    
    const cierreLines = doc.splitTextToSize(cierre, 160);
    doc.text(cierreLines, marginX, currentY);

    // 6. Espacio para Firma/Sello Digital
    currentY += 40;
    doc.setLineWidth(0.5);
    doc.line(70, currentY, 140, currentY); // Línea de firma
    doc.setFontSize(9);
    doc.text("DEPARTAMENTO DE OPERACIONES", 105, currentY + 5, { align: "center" });
    doc.text("Documento generado electrónicamente", 105, currentY + 10, { align: "center" });

    // Descarga
    doc.save(`Certificado_${usuario.numeroDoc}.pdf`);
}

btnDescargar.addEventListener("click", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));


    if (!usuario) {
        alertas.mostrarErrorGeneral("No hay usuario activo");
        return;
    }

    generarCertificado(usuario);

});