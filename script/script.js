const uploadInput = document.getElementById('upload');
const modeSelect = document.getElementById('mode');
const processButton = document.getElementById('process');
const downloadsDiv = document.getElementById('downloads');
const resetButton = document.getElementById('reset');

// Função para dividir PDF em páginas individuais e zipar
async function splitPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const zip = new JSZip();

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFLib.PDFDocument.create();
    const [page] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(page);

    const pdfBytes = await newPdf.save();
    zip.file(`pagina_${i + 1}.pdf`, pdfBytes);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);

  downloadsDiv.innerHTML = "";
  const link = document.createElement('a');
  link.href = url;
  link.download = "pdf_dividido.zip";
  link.textContent = "Baixar todas as páginas (ZIP)";
  downloadsDiv.appendChild(link);
}

// Função para juntar múltiplos PDFs em um único arquivo
async function mergePDFs(files) {
  const mergedPdf = await PDFLib.PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  downloadsDiv.innerHTML = "";
  const link = document.createElement('a');
  link.href = url;
  link.download = "juntado.pdf";
  link.textContent = "Baixar PDF Unificado";
  downloadsDiv.appendChild(link);
}

// Função para limpar os campos e resultados
function resetForm() {
  uploadInput.value = '';
  modeSelect.value = 'split';
  downloadsDiv.innerHTML = '';
}

// Evento de clique no botão "Executar"
processButton.addEventListener('click', async () => {
  const files = uploadInput.files;
  const mode = modeSelect.value;

  if (mode === "split") {
    if (files.length !== 1) {
      alert("Selecione exatamente 1 PDF para dividir.");
      return;
    }
    await splitPDF(files[0]);
  }

  if (mode === "merge") {
    if (files.length < 2) {
      alert("Selecione pelo menos 2 arquivos PDF para juntar.");
      return;
    }
    await mergePDFs(files);
  }
});

// Evento de clique no botão "Limpar"
resetButton.addEventListener('click', resetForm);
