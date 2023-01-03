// import my library
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const http = require('http');
// const app = express();
const cors = require('cors');

const app = express();


app.use(cors({
  origin: '*',
}));



var fname;

// Set up multer to handle file uploads
const storage = multer.diskStorage({
       destination: (req, file, cb) => {
              cb(null, './');
       },
       filename: (req, file, cb) => {
              fname = `${file.fieldname}-${Date.now()}.pdf`;
              cb(null, fname);
       },
});

const upload = multer({ storage });
app.use("/upload",(req,res)=>{
       res.json({Message: "Hello From My World "});
})

// Set up a route to handle file uploads
app.post('/', upload.single('file'), (req, res,next) => {
  
  console.log("Your IP Addresss is: " + req.socket.localAddress);
       // Read the input PDF file
       const file = req.file;
       if (!file) {
              const error = new Error("Please upload a file");
              error.httpStatusCode = 400;
              return next(error);
       }
       // crop uploaded file

       async function cropPDF(inputPath, outputPath, x, y, width, height) {
              // Read the input PDF file
              let pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath));

              //   Loop through all pages in the PDF
              for (let i = 0; i < pdfDoc.getPages().length; i++) {


                     // Get the page that you want to crop
                     let page = pdfDoc.getPage(i);

                     // Set the crop box for the page
                     page.setCropBox(x, y, width, height);
              }
              // console.log();
              // Save the output PDF file
              fs.writeFileSync(outputPath, await pdfDoc.save());
              fs.unlink( fname, (err) => {
                     if (err) {
                       console.error(err);
                     } else {
                       console.log('File deleted successfully');
                     }
                   });


                   res.download(outputPath);
              // fs.unlink();

       }
       console.log(req.body.Ecommerce);
       if(req.body.Ecommerce==1)
       {

       cropPDF('./' + fname,'outputfiledownload.pdf', 170, 467, 255, 353)
              .then(() => {
                     console.log("PDF is cropped");
                     // PDF has been cropped
              })
              .catch((error) => {
                     console.log(error);
              });
       

       }
       else if(req.body.Ecommerce==2)
       {
             
              cropPDF('./' + fname,'outputfiledownload.pdf',  0, 490, 600, 600)
              .then(() => {
                     console.log("Meesho is cropped");
                     // PDF has been cropped
              })
              .catch((error) => {
                     console.log(error);
              });
       

       }

       // console.log(req.file);


       console.log("File downloaded");




       // call Python api in node js


       //  delete file 






       // You can now do something with the uploaded file, such as storing it in a database or sending it to another API

});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
       console.log(`Server listening on port ${port}`);
});


