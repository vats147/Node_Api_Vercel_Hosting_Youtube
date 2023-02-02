// import my library

// express  library for connection 
const express = require('express');

// Multer Library for multi file handling
const multer = require('multer');

// fs for filesystem accessing file 
const fs = require('fs');

// pdf-lib for pdf handling ( Cropping )
const { PDFDocument } = require('pdf-lib');


// http for http connection
const cors = require('cors');

// os for getting total number of cpu
const os = require('os');

// cluster for creating multiple process
const cluster = require('cluster');

// Add PDF merger library for merging pdf
const PDFMerger = require('pdf-merger-js');


// count total number of cpu
const cpuNums = os.cpus().length;
// print Total Number Of cpus
console.log("Total Number of Cpus(CORS):" + cpuNums);

var fname;
var mname;
var check = 0;
var fileNames = [];


var date = new Date();
const app = express();

var merger = new PDFMerger();



// allowed http 
app.use(cors({
       origin: '*',
}));


// MergePDF function for merging files and save as merged.pdf

async function mergePdfs(pdfs) {
       for (const pdf of pdfs) {
              await merger.add(pdf);
       }
       mname = './merged-' + Date.now() + '.pdf';
       await merger.save(mname);
}


// Set up multer to handle file uploads and save files 
const storage = multer.diskStorage({
       destination: (req, file, cb) => {
              cb(null, './');
       },
       filename: (req, file, cb) => {
              check++;
              fname = `${file.fieldname} ${check}-${Date.now()}.pdf`;
              console.log("Filename : " + fname);
              fileNames.push(fname);
              cb(null, fname);
       }
});


const upload = multer({ storage });




// implementing multi threading for fast execution
// checking if process is primary or not 
if (cluster.isPrimary) {
       // creating multiple process
       for (let i = 0; i < 4; i++) {
              // create copy of process 
              cluster.fork();

       }


       cluster.on('exit', () => {
              cluster.fork();
       })
} else {

       app.post('/', upload.array('pdfs', 5), async (req, res, next) => {

              console.log(req.body.settingTwo);
              


              console.log("=================================================");
              console.log("API Last Build Date " + date.toUTCString());
              console.log("API Last Build  Time" + date.toLocaleTimeString());

              console.log(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
              console.log("===========================");

              console.log("LAST API CALL TIME:--" + date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

              console.log("===========================");



              // crop uploaded file with x,y,width,height
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
                     for(let i=0;i<fileNames.length;i++){
                            fs.unlink(fileNames[i],(err)=>{
                                   if(err){
                                          console.log(err);
                                   }
              
                            });
                     }
                     // clear array
                     fileNames=[];

                     // check if mname is contain any value or not??
                     if(mname)
                     {
                     fs.unlink(mname, (err) => {
                            if (err) {

                                   console.error(err);


                            } else {
                                   console.log('Merged Files deleted successfully');
                            }
                     });
              }
               mname=null;


                     res.download(outputPath);


              }

              console.log(req.body.Ecommerce);
              if(req.body.settingTwo)
              {
              // check length of files
              if (req.files.length > 1) {
                     const pdfPaths = req.files.map(file => file.path);
                     await mergePdfs(pdfPaths);
                     //   fileNames.push(fname);
                     if (req.body.Ecommerce == 1) {

                            cropPDF(  mname, 'outputfiledownload.pdf', 170, 467, 255, 353)
                                   .then(() => {
                                          console.log("PDF is cropped");
                                          // PDF has been cropped
                                   })
                                   .catch((error) => {
                                          console.log(error);
                                   });


                     }
                     else if (req.body.Ecommerce == 2) {

                            cropPDF(mname, 'outputfiledownload.pdf', 0, 490, 600, 600)
                                   .then(() => {
                                          console.log("Meesho is cropped");
                                          // PDF has been cropped
                                   })
                                   .catch((error) => {
                                          console.log(error);
                                   });


                     }
                     else if (req.body.Ecommerce == 3) {

                            cropPDF(mname, 'outputfiledownload.pdf', 25, 220, 545, 300)
                                   .then(() => {
                                          console.log("GlowRoad is cropped");
                                          // PDF has been cropped
                                   })
                                   .catch((error) => {
                                          console.log(error);
                                   });


                     }


              }
              
       }else {
                     if (req.body.Ecommerce == 1) {

                            cropPDF('./' + fname, 'outputfiledownload.pdf', 170, 467, 255, 353)
                                   .then(() => {
                                          console.log("PDF is cropped");
                                          // PDF has been cropped
                                   })
                                   .catch((error) => {
                                          console.log(error);
                                   });


                     }
                     else if (req.body.Ecommerce == 2) {

                            cropPDF('./' + fname, 'outputfiledownload.pdf', 0, 490, 600, 600)
                                   .then(() => {
                                          console.log("Meesho is cropped");
                                          // PDF has been cropped
                                   })
                                   .catch((error) => {
                                          console.log(error);
                                   });


                     }
                     else if (req.body.Ecommerce == 3) {

                            cropPDF('./' + fname, 'outputfiledownload.pdf', 25, 220, 545, 300)
                                   .then(() => {
                                          console.log("GlowRoad is cropped");
                                          // PDF has been cropped
                                   })
                                   .catch((error) => {
                                          console.log(error);
                                   });


                     }

                     //      res.sendFile(path.join(__dirname, req.files[0].path));


              }






              console.log("File downloaded");






       });

       // Start the server
       const port = process.env.PORT || 3000;
       app.listen(port, () => {
              console.log(`Server listening on port ${port}`);
       });
}
