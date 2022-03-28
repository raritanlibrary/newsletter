#!/bin/bash

pdftk="/c/Program Files (x86)/PDFtk/bin/pdftk.exe"

# Get name of month
year=$(date --date="$(date) + 14 day" +%Y)
month=$(date --date="$(date) + 14 day" +%B)
fdate="$year$month"

# Combine PDFs
pdftk "out/newsletter-front_$fdate.pdf" "out/newsletter-back_$fdate.pdf" cat output "out/newsletter-$fdate.pdf"

# Delete Individual PDFs
rm "out/newsletter-front_$fdate.pdf" "out/newsletter-back_$fdate.pdf"