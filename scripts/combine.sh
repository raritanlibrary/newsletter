#!/bin/bash

# Set program variables
pdftk="/c/Program Files (x86)/PDFtk/bin/pdftk.exe"

# Get name of month
year=$(date --date="$(date) + 14 day" +%Y)
month=$(date --date="$(date) + 14 day" +%B)
fdate="$year$month"

# Combine PDFs
"$pdftk" "out/newsletter_front_$fdate.pdf" "out/newsletter_back_$fdate.pdf" cat output "out/newsletter_$fdate.pdf"

# Delete Individual PDFs
rm "out/newsletter_front_$fdate.pdf" "out/newsletter_back_$fdate.pdf"