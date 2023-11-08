const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());

// Define Mongoose schema and model for PDF documents
const pdfSchema = new mongoose.Schema({
  originalName: { type: String, required: true},
  storedName: { type: String, required: true},
  uploadedAt: Date,
  userId: { type: String, required: true},
});
const Pdf = mongoose.model('Pdf', pdfSchema);

// Handle file upload and storage
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// home route just to check if the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Node API app is running' });
});

// Upload PDFs route
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, filename } = req.file;


    const pdf = new Pdf({
      originalName: originalname,
      storedName: filename,
      uploadedAt: new Date(),
      userId: req.body.userId,
    });
    await pdf.save();

    res.json({ id: pdf._id, name: pdf.storedName, message: 'PDF Uploaded Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

// Serve uploaded PDFs
app.use('/pdfs', express.static(path.join(__dirname, 'uploads')));

// Extract selected pages (example)
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

// Extract selected pages route
app.post('/extract', async (req, res) => {
  try {
    const { id, selectedPageNumbers, userId } = req.body;

    const grabDoc = await Pdf.findById(id);

    const storedName = grabDoc.storedName;

    console.log(storedName, selectedPageNumbers)

    const pdfPath = `uploads/${storedName}`;

    const pdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdfDoc = await PDFDocument.create();

    const copiedPage = await newPdfDoc.copyPages(pdfDoc, selectedPageNumbers);
    copiedPage.forEach((page) => {
      newPdfDoc.addPage(page);
    });

    const newPdfBytes = await newPdfDoc.save();
    const newPdfPath = `uploads/new_${storedName}`;

    await fs.writeFile(newPdfPath, newPdfBytes);

    const pdf = new Pdf({
      originalName: `new_${grabDoc.originalName}`,
      storedName: `new_${storedName}`,
      uploadedAt: new Date(),
      userId: userId,
    });
    await pdf.save();


    res.json({ id: `new_${storedName}`, message: 'Pages Extracted Successfully' });
  } catch (error) {
    console.error('Error extracting PDF:', error);
    res.status(500).json({ error: 'Failed to extract pages' });
  }
});

// get all PDFs for a user route
app.get('/mypdfs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pdfs = await Pdf.find({ userId });
    res.json(pdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get PDFs' });
  }
});

// delete a PDF route
app.delete('/pdf/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await Pdf.findByIdAndDelete(id);
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete PDF' });
  }
});

// Start the Express server
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 4000, () => {
      console.log('Node API app is running on port 4000');
    });
  })
  .catch((error) => {
    console.log(error);
  });
