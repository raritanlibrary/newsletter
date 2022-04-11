# **Raritan Public Library Newsletter Generator**
This **newsletter** generator provides a quick and easy solution to semi-automatiaclly creating monthly newsletters for Raritan Public Library.

## **Installation**

### **Node.js/npm**
First, download or clone the latest version of this repository. Once you have the repository downloaded in a suitable location, run the following commands to check to make sure you have **Node.js** and **npm** installed.
```
node --version
npm --version
```
Then, run the following command to install the necessary npm packages.
```
npm install
```

### **PDFtk**
This newsletter generator uses **PDFtk** to combine PDFs together. You can download the [installer for Windows](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/), or if you are using Ubuntu or Debian, run the following command:
```
apt-get install pdftk
```
Then, run the following command to ensure it is installed correctly:
```
pdftk
```

## **Usage**
By default, newsletters will be generated using the latest commit to the main branch of the [**www**](https://github.com/raritanlibrary/www) **repository**. Relevant data from the [`events.yaml`](https://github.com/raritanlibrary/www/blob/main/src/data/events.yaml) and [`news.yaml`](https://github.com/raritanlibrary/www/blob/main/src/data/news.yaml) files will be extracted and parsed to be injected into the contents of the newsletter.

### **Start dev server / Preview newsletter**
```
npm run dev
```
This command starts up the development server, but to view page previews you will need to visit the `front.html` and `back.html` pages. You also may have to refresh cache (<kbd>CTRL</kbd>+<kbd>F5</kbd>) for new changes to take effect. You can also run `npm run redev` to clear cache when starting the development server, which is useful for when Parcel's hot reloading feature breaks (this is especially problematic with stylesheets).

**NOTE:** When running a development server, both the `src/stylus/main.styl` and `src/front.pug` files are modified to apply certain stylesheet properties to the eBlast. This should automatically reset to normal after the server is shut down, but please make sure that the file remains unchanged from its original state if you did not modify it.

### **Monthly Picks**
A major aspect of these newsletters that is not generated through existing data in the www repository are new books, CDs, and DVDs selected by Library staff. Fill out the appropriate fields in the `src/includes/picks.pug` file before rendering a newsletter.

### **Render newsletter**
*It is **required** that you keep the development server running while this process takes place.*
```
npm run make
```
This command generates the newsletter and saves the resulting .pdf file in the `out` directory.

## **Issues and Contributing**
Pull requests are encouraged by the Raritan Public Library to ensure our software is of the highest quality possible. If you would like to suggest major changes or restructuring of this repository, please [open an issue](https://github.com/raritanlibrary/newsletter/issues/new). It is also strongly suggested you email us at [raritanlibrary54@aol.com](mailto:raritanlibrary54@aol.com).

## **License**
[MIT](LICENSE)